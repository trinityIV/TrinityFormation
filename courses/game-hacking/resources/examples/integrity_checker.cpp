#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <map>
#include <filesystem>
#include <cryptopp/sha.h>
#include <cryptopp/hex.h>
#include <cryptopp/files.h>
#include <json/json.h>

namespace fs = std::filesystem;

class IntegrityChecker {
private:
    std::map<std::string, std::string> referenceHashes;
    std::string databasePath;
    const size_t BUFFER_SIZE = 4096;

    std::string calculateFileHash(const std::string& filePath) {
        try {
            CryptoPP::SHA256 hash;
            std::string digest;
            
            // Lecture du fichier par blocs pour optimiser la mémoire
            std::ifstream file(filePath, std::ios::binary);
            if (!file) {
                throw std::runtime_error("Impossible d'ouvrir le fichier: " + filePath);
            }

            std::vector<char> buffer(BUFFER_SIZE);
            while (file.good()) {
                file.read(buffer.data(), buffer.size());
                hash.Update(reinterpret_cast<const byte*>(buffer.data()), file.gcount());
            }

            digest.resize(hash.DigestSize());
            hash.Final(reinterpret_cast<byte*>(&digest[0]));

            // Conversion en hexadécimal
            std::string hexHash;
            CryptoPP::HexEncoder encoder(new CryptoPP::StringSink(hexHash));
            encoder.Put(reinterpret_cast<const byte*>(digest.data()), digest.size());
            encoder.MessageEnd();

            return hexHash;
        }
        catch (const std::exception& e) {
            throw std::runtime_error("Erreur lors du calcul du hash: " + std::string(e.what()));
        }
    }

    void loadReferenceHashes() {
        try {
            std::ifstream file(databasePath);
            if (!file.is_open()) {
                throw std::runtime_error("Impossible d'ouvrir la base de données de référence");
            }

            Json::Value root;
            file >> root;

            for (const auto& member : root.getMemberNames()) {
                referenceHashes[member] = root[member].asString();
            }
        }
        catch (const std::exception& e) {
            throw std::runtime_error("Erreur lors du chargement des hashes de référence: " + std::string(e.what()));
        }
    }

    void saveReferenceHashes() {
        try {
            Json::Value root;
            for (const auto& [path, hash] : referenceHashes) {
                root[path] = hash;
            }

            std::ofstream file(databasePath);
            if (!file.is_open()) {
                throw std::runtime_error("Impossible de sauvegarder la base de données");
            }

            file << root;
        }
        catch (const std::exception& e) {
            throw std::runtime_error("Erreur lors de la sauvegarde des hashes: " + std::string(e.what()));
        }
    }

public:
    IntegrityChecker(const std::string& dbPath = "integrity.json") 
        : databasePath(dbPath) {
        try {
            loadReferenceHashes();
        }
        catch (const std::exception& e) {
            std::cout << "Notice: " << e.what() << ". Une nouvelle base sera créée." << std::endl;
        }
    }

    void addReference(const std::string& filePath) {
        if (!fs::exists(filePath)) {
            throw std::runtime_error("Fichier non trouvé: " + filePath);
        }

        std::string hash = calculateFileHash(filePath);
        referenceHashes[filePath] = hash;
        saveReferenceHashes();
    }

    bool verifyFileIntegrity(const std::string& filePath) {
        if (!fs::exists(filePath)) {
            throw std::runtime_error("Fichier non trouvé: " + filePath);
        }

        auto it = referenceHashes.find(filePath);
        if (it == referenceHashes.end()) {
            throw std::runtime_error("Pas de hash de référence pour: " + filePath);
        }

        std::string currentHash = calculateFileHash(filePath);
        return currentHash == it->second;
    }

    struct IntegrityReport {
        bool passed;
        std::string filePath;
        std::string expectedHash;
        std::string actualHash;
        std::string message;
    };

    std::vector<IntegrityReport> generateReport(const std::string& directory) {
        std::vector<IntegrityReport> reports;

        for (const auto& entry : fs::recursive_directory_iterator(directory)) {
            if (!entry.is_regular_file()) continue;

            std::string filePath = entry.path().string();
            try {
                std::string currentHash = calculateFileHash(filePath);
                auto it = referenceHashes.find(filePath);

                IntegrityReport report;
                report.filePath = filePath;
                report.actualHash = currentHash;

                if (it != referenceHashes.end()) {
                    report.expectedHash = it->second;
                    report.passed = (currentHash == it->second);
                    report.message = report.passed ? "OK" : "Hash mismatch";
                } else {
                    report.passed = false;
                    report.message = "Fichier non référencé";
                }

                reports.push_back(report);
            }
            catch (const std::exception& e) {
                IntegrityReport report;
                report.filePath = filePath;
                report.passed = false;
                report.message = "Erreur: " + std::string(e.what());
                reports.push_back(report);
            }
        }

        return reports;
    }

    void printReport(const std::vector<IntegrityReport>& reports) {
        std::cout << "\n=== Rapport d'intégrité ===\n" << std::endl;
        
        int totalFiles = reports.size();
        int passedFiles = 0;

        for (const auto& report : reports) {
            if (report.passed) passedFiles++;

            std::cout << "Fichier: " << report.filePath << std::endl;
            std::cout << "Status: " << (report.passed ? "✓" : "✗") << " " << report.message << std::endl;
            
            if (!report.passed && !report.expectedHash.empty()) {
                std::cout << "Hash attendu: " << report.expectedHash << std::endl;
                std::cout << "Hash actuel:  " << report.actualHash << std::endl;
            }
            std::cout << "-------------------" << std::endl;
        }

        float passRate = (totalFiles > 0) ? (passedFiles * 100.0f / totalFiles) : 0;
        std::cout << "\nRésumé:" << std::endl;
        std::cout << "Total fichiers: " << totalFiles << std::endl;
        std::cout << "Fichiers valides: " << passedFiles << std::endl;
        std::cout << "Taux de réussite: " << passRate << "%" << std::endl;
    }
};

// Exemple d'utilisation
int main() {
    try {
        IntegrityChecker checker;

        // Ajout de références
        checker.addReference("game.exe");
        checker.addReference("data/assets.pak");

        // Vérification d'un fichier
        if (checker.verifyFileIntegrity("game.exe")) {
            std::cout << "L'intégrité du fichier game.exe est vérifiée" << std::endl;
        }

        // Génération et affichage d'un rapport
        auto reports = checker.generateReport(".");
        checker.printReport(reports);
    }
    catch (const std::exception& e) {
        std::cerr << "Erreur: " << e.what() << std::endl;
        return 1;
    }

    return 0;
}
