#include <iostream>
#include <vector>
#include <map>
#include <windows.h>
#include <memory>
#include <cstdint>
#include <algorithm>

class MemoryProtector {
private:
    struct ProtectedRegion {
        uintptr_t address;
        size_t size;
        DWORD originalProtection;
        std::vector<uint8_t> checksum;
    };

    std::map<uintptr_t, ProtectedRegion> protectedRegions;
    const size_t CHUNK_SIZE = 4096;

    // Fonction de chiffrement XOR simple pour l'exemple
    void xorEncrypt(std::vector<uint8_t>& data, const uint8_t key) {
        for (auto& byte : data) {
            byte ^= key;
        }
    }

    std::vector<uint8_t> calculateChecksum(const void* address, size_t size) {
        std::vector<uint8_t> checksum(size);
        memcpy(checksum.data(), address, size);
        
        // Rotation des bits pour une meilleure détection
        for (size_t i = 1; i < size; ++i) {
            checksum[i] = (checksum[i] << 4) | (checksum[i] >> 4);
            checksum[i] ^= checksum[i - 1];
        }

        return checksum;
    }

    bool verifyChecksum(const void* address, size_t size, const std::vector<uint8_t>& originalChecksum) {
        auto currentChecksum = calculateChecksum(address, size);
        return currentChecksum == originalChecksum;
    }

public:
    bool protectRegion(void* address, size_t size) {
        try {
            MEMORY_BASIC_INFORMATION mbi;
            if (VirtualQuery(address, &mbi, sizeof(mbi)) == 0) {
                throw std::runtime_error("Impossible d'obtenir les informations mémoire");
            }

            // Aligner l'adresse et la taille sur les limites de page
            uintptr_t alignedAddress = (uintptr_t)address & ~(CHUNK_SIZE - 1);
            size_t alignedSize = ((size + CHUNK_SIZE - 1) & ~(CHUNK_SIZE - 1));

            DWORD oldProtection;
            if (!VirtualProtect((LPVOID)alignedAddress, alignedSize, PAGE_READWRITE, &oldProtection)) {
                throw std::runtime_error("Impossible de modifier la protection mémoire");
            }

            // Créer une copie des données et les chiffrer
            std::vector<uint8_t> data(size);
            memcpy(data.data(), address, size);
            xorEncrypt(data, 0x55); // Clé XOR simple pour l'exemple
            memcpy(address, data.data(), size);

            // Restaurer la protection avec PAGE_GUARD
            DWORD newProtection = oldProtection | PAGE_GUARD;
            if (!VirtualProtect((LPVOID)alignedAddress, alignedSize, newProtection, &oldProtection)) {
                throw std::runtime_error("Impossible de restaurer la protection mémoire");
            }

            // Enregistrer la région protégée
            ProtectedRegion region{
                (uintptr_t)address,
                size,
                oldProtection,
                calculateChecksum(address, size)
            };
            protectedRegions[(uintptr_t)address] = region;

            return true;
        }
        catch (const std::exception& e) {
            std::cerr << "Erreur lors de la protection: " << e.what() << std::endl;
            return false;
        }
    }

    bool unprotectRegion(void* address) {
        auto it = protectedRegions.find((uintptr_t)address);
        if (it == protectedRegions.end()) {
            return false;
        }

        try {
            const auto& region = it->second;
            
            // Désactiver temporairement la protection pour déchiffrer
            DWORD oldProtection;
            if (!VirtualProtect((LPVOID)region.address, region.size, PAGE_READWRITE, &oldProtection)) {
                throw std::runtime_error("Impossible de modifier la protection mémoire");
            }

            // Déchiffrer les données
            std::vector<uint8_t> data(region.size);
            memcpy(data.data(), (void*)region.address, region.size);
            xorEncrypt(data, 0x55);
            memcpy((void*)region.address, data.data(), region.size);

            // Restaurer la protection d'origine
            if (!VirtualProtect((LPVOID)region.address, region.size, region.originalProtection, &oldProtection)) {
                throw std::runtime_error("Impossible de restaurer la protection mémoire");
            }

            protectedRegions.erase(it);
            return true;
        }
        catch (const std::exception& e) {
            std::cerr << "Erreur lors de la déprotection: " << e.what() << std::endl;
            return false;
        }
    }

    bool verifyRegion(void* address) {
        auto it = protectedRegions.find((uintptr_t)address);
        if (it == protectedRegions.end()) {
            return false;
        }

        const auto& region = it->second;
        return verifyChecksum((void*)region.address, region.size, region.checksum);
    }

    void handleMemoryAccess(void* address) {
        auto it = protectedRegions.find((uintptr_t)address);
        if (it != protectedRegions.end()) {
            const auto& region = it->second;
            
            // Vérifier l'intégrité
            if (!verifyRegion((void*)region.address)) {
                std::cout << "Alerte: Modification détectée à l'adresse " 
                         << std::hex << region.address << std::endl;
            }

            // Réactiver la protection PAGE_GUARD
            DWORD oldProtection;
            VirtualProtect((LPVOID)region.address, region.size, 
                          region.originalProtection | PAGE_GUARD, &oldProtection);
        }
    }
};

// Handler d'exception pour PAGE_GUARD
LONG WINAPI VectoredHandler(PEXCEPTION_POINTERS pExceptionInfo) {
    if (pExceptionInfo->ExceptionRecord->ExceptionCode == STATUS_GUARD_PAGE_VIOLATION) {
        // Ici, vous appelleriez handleMemoryAccess de votre instance de MemoryProtector
        return EXCEPTION_CONTINUE_EXECUTION;
    }
    return EXCEPTION_CONTINUE_SEARCH;
}

// Exemple d'utilisation
int main() {
    // Installer le handler d'exception
    AddVectoredExceptionHandler(1, VectoredHandler);

    MemoryProtector protector;
    
    // Exemple de données à protéger
    int testData = 42;
    
    std::cout << "Valeur initiale: " << testData << std::endl;
    
    // Protéger la région
    if (protector.protectRegion(&testData, sizeof(testData))) {
        std::cout << "Protection activée" << std::endl;
    }

    // Tentative de modification (déclenchera une exception PAGE_GUARD)
    testData = 100;

    // Vérifier l'intégrité
    if (protector.verifyRegion(&testData)) {
        std::cout << "Intégrité vérifiée" << std::endl;
    } else {
        std::cout << "Modification détectée!" << std::endl;
    }

    // Déprotéger la région
    if (protector.unprotectRegion(&testData)) {
        std::cout << "Protection désactivée" << std::endl;
    }

    return 0;
}
