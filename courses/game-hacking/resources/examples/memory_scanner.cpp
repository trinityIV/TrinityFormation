#include <iostream>
#include <vector>
#include <map>
#include <windows.h>
#include <tlhelp32.h>
#include <memory>

class MemoryScanner {
private:
    HANDLE processHandle;
    DWORD processId;
    std::map<uintptr_t, SIZE_T> suspiciousRegions;

public:
    MemoryScanner() : processHandle(NULL), processId(0) {}

    bool attachToProcess(const wchar_t* processName) {
        processId = getProcessIdByName(processName);
        if (processId == 0) {
            std::cout << "Processus non trouvé" << std::endl;
            return false;
        }

        processHandle = OpenProcess(PROCESS_VM_READ | PROCESS_QUERY_INFORMATION, FALSE, processId);
        return processHandle != NULL;
    }

    void scanForSuspiciousPatterns() {
        MEMORY_BASIC_INFORMATION mbi;
        uintptr_t address = 0;

        while (VirtualQueryEx(processHandle, (LPCVOID)address, &mbi, sizeof(mbi))) {
            if (mbi.State == MEM_COMMIT && 
                (mbi.Type == MEM_PRIVATE || mbi.Type == MEM_MAPPED) &&
                (mbi.Protect == PAGE_READWRITE || mbi.Protect == PAGE_EXECUTE_READWRITE)) {
                
                std::vector<uint8_t> buffer(mbi.RegionSize);
                SIZE_T bytesRead;

                if (ReadProcessMemory(processHandle, mbi.BaseAddress, buffer.data(), mbi.RegionSize, &bytesRead)) {
                    if (containsSuspiciousPattern(buffer)) {
                        suspiciousRegions[(uintptr_t)mbi.BaseAddress] = mbi.RegionSize;
                    }
                }
            }
            address = (uintptr_t)mbi.BaseAddress + mbi.RegionSize;
        }
    }

    void reportFindings() {
        std::cout << "Régions suspectes trouvées: " << suspiciousRegions.size() << std::endl;
        for (const auto& region : suspiciousRegions) {
            std::cout << "Adresse: 0x" << std::hex << region.first 
                      << ", Taille: 0x" << region.second << std::endl;
        }
    }

    ~MemoryScanner() {
        if (processHandle) {
            CloseHandle(processHandle);
        }
    }

private:
    DWORD getProcessIdByName(const wchar_t* processName) {
        DWORD processId = 0;
        HANDLE snapshot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
        
        if (snapshot != INVALID_HANDLE_VALUE) {
            PROCESSENTRY32W processEntry;
            processEntry.dwSize = sizeof(processEntry);

            if (Process32FirstW(snapshot, &processEntry)) {
                do {
                    if (_wcsicmp(processEntry.szExeFile, processName) == 0) {
                        processId = processEntry.th32ProcessID;
                        break;
                    }
                } while (Process32NextW(snapshot, &processEntry));
            }
            CloseHandle(snapshot);
        }
        return processId;
    }

    bool containsSuspiciousPattern(const std::vector<uint8_t>& buffer) {
        // Exemple de patterns suspects (à adapter selon les besoins)
        static const std::vector<std::vector<uint8_t>> patterns = {
            // Pattern pour une modification de santé commune
            {0x90, 0x90, 0x90, 0x90, 0x90},  // NOP slide
            // Pattern pour un hook d'API
            {0xFF, 0x25, 0x00, 0x00, 0x00, 0x00},  // jmp [address]
        };

        for (const auto& pattern : patterns) {
            if (findPattern(buffer, pattern)) {
                return true;
            }
        }
        return false;
    }

    bool findPattern(const std::vector<uint8_t>& buffer, const std::vector<uint8_t>& pattern) {
        if (pattern.size() > buffer.size()) return false;

        for (size_t i = 0; i <= buffer.size() - pattern.size(); ++i) {
            bool found = true;
            for (size_t j = 0; j < pattern.size(); ++j) {
                if (buffer[i + j] != pattern[j]) {
                    found = false;
                    break;
                }
            }
            if (found) return true;
        }
        return false;
    }
};

// Exemple d'utilisation
int main() {
    MemoryScanner scanner;

    if (scanner.attachToProcess(L"target_game.exe")) {
        std::cout << "Scan en cours..." << std::endl;
        scanner.scanForSuspiciousPatterns();
        scanner.reportFindings();
    } else {
        std::cout << "Impossible d'attacher au processus" << std::endl;
    }

    return 0;
}
