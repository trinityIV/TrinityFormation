#include <iostream>
#include <vector>
#include <functional>
#include <chrono>
#include <thread>

class BasicDetector {
private:
    struct MemoryRegion {
        uintptr_t address;
        size_t size;
        std::vector<uint8_t> checksum;
    };

    std::vector<MemoryRegion> monitoredRegions;
    std::vector<std::function<void(const MemoryRegion&)>> callbacks;
    bool isRunning;

public:
    BasicDetector() : isRunning(false) {}

    void addRegion(uintptr_t address, size_t size) {
        MemoryRegion region;
        region.address = address;
        region.size = size;
        region.checksum = calculateChecksum(address, size);
        monitoredRegions.push_back(region);
    }

    void addCallback(std::function<void(const MemoryRegion&)> callback) {
        callbacks.push_back(callback);
    }

    void start() {
        isRunning = true;
        monitoringThread = std::thread([this]() {
            while (isRunning) {
                checkMemoryModifications();
                std::this_thread::sleep_for(std::chrono::milliseconds(100));
            }
        });
    }

    void stop() {
        isRunning = false;
        if (monitoringThread.joinable()) {
            monitoringThread.join();
        }
    }

private:
    std::thread monitoringThread;

    std::vector<uint8_t> calculateChecksum(uintptr_t address, size_t size) {
        std::vector<uint8_t> checksum;
        // Simulation d'un calcul de checksum
        // Dans une implémentation réelle, on calculerait un vrai checksum
        checksum.resize(size);
        memcpy(checksum.data(), reinterpret_cast<void*>(address), size);
        return checksum;
    }

    void checkMemoryModifications() {
        for (const auto& region : monitoredRegions) {
            auto currentChecksum = calculateChecksum(region.address, region.size);
            if (currentChecksum != region.checksum) {
                for (const auto& callback : callbacks) {
                    callback(region);
                }
            }
        }
    }
};

// Exemple d'utilisation
int main() {
    BasicDetector detector;

    // Ajout d'une région à surveiller
    int testValue = 42;
    detector.addRegion(reinterpret_cast<uintptr_t>(&testValue), sizeof(testValue));

    // Ajout d'un callback de détection
    detector.addCallback([](const BasicDetector::MemoryRegion& region) {
        std::cout << "Modification détectée à l'adresse: " << std::hex << region.address << std::endl;
    });

    // Démarrage de la détection
    detector.start();

    // Simulation d'une modification
    std::this_thread::sleep_for(std::chrono::seconds(1));
    testValue = 100;
    std::this_thread::sleep_for(std::chrono::seconds(1));

    // Arrêt de la détection
    detector.stop();

    return 0;
}
