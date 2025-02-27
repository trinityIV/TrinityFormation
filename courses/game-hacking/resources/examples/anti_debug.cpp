#include <iostream>
#include <windows.h>
#include <tlhelp32.h>
#include <vector>
#include <string>
#include <memory>

class AntiDebugSystem {
private:
    struct DebuggerSignature {
        std::wstring processName;
        std::wstring windowClass;
        std::wstring windowTitle;
    };

    std::vector<DebuggerSignature> knownDebuggers = {
        {L"ollydbg.exe", L"OLLYDBG", L""},
        {L"x64dbg.exe", L"X64_DBG", L""},
        {L"windbg.exe", L"WinDbgFrameClass", L""},
        {L"ida.exe", L"QWidget", L"IDA"},
        {L"ida64.exe", L"QWidget", L"IDA"}
    };

    bool isBeingDebugged() {
        // Vérification IsDebuggerPresent
        if (IsDebuggerPresent()) {
            return true;
        }

        // Vérification CheckRemoteDebuggerPresent
        BOOL isDebuggerPresent = FALSE;
        CheckRemoteDebuggerPresent(GetCurrentProcess(), &isDebuggerPresent);
        if (isDebuggerPresent) {
            return true;
        }

        // Vérification PEB
        __try {
            __asm {
                mov eax, fs:[0x30]    // Get PEB
                mov al, [eax + 0x2]   // Get BeingDebugged flag
                test al, al           // Check if it's set
                jne debugged
            }
            return false;
        debugged:
            return true;
        }
        __except(EXCEPTION_EXECUTE_HANDLER) {
            return false;
        }
    }

    bool checkDebuggerWindows() {
        for (const auto& debugger : knownDebuggers) {
            HWND hwnd = FindWindowW(debugger.windowClass.c_str(), debugger.windowTitle.c_str());
            if (hwnd != NULL) {
                return true;
            }
        }
        return false;
    }

    bool checkDebuggerProcesses() {
        HANDLE snapshot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
        if (snapshot == INVALID_HANDLE_VALUE) {
            return false;
        }

        PROCESSENTRY32W pe32;
        pe32.dwSize = sizeof(pe32);

        if (!Process32FirstW(snapshot, &pe32)) {
            CloseHandle(snapshot);
            return false;
        }

        do {
            for (const auto& debugger : knownDebuggers) {
                if (_wcsicmp(pe32.szExeFile, debugger.processName.c_str()) == 0) {
                    CloseHandle(snapshot);
                    return true;
                }
            }
        } while (Process32NextW(snapshot, &pe32));

        CloseHandle(snapshot);
        return false;
    }

    bool checkHardwareBreakpoints() {
        CONTEXT ctx = {};
        ctx.ContextFlags = CONTEXT_DEBUG_REGISTERS;

        if (!GetThreadContext(GetCurrentThread(), &ctx)) {
            return false;
        }

        return ctx.Dr0 != 0 || ctx.Dr1 != 0 || ctx.Dr2 != 0 || ctx.Dr3 != 0;
    }

    void setupAntiAttach() {
        // Empêcher l'attachement d'un debugger
        typedef NTSTATUS(NTAPI* pNtSetInformationProcess)(
            HANDLE ProcessHandle,
            ULONG ProcessInformationClass,
            PVOID ProcessInformation,
            ULONG ProcessInformationLength
        );

        HMODULE hNtdll = GetModuleHandleW(L"ntdll.dll");
        if (hNtdll) {
            pNtSetInformationProcess NtSetInformationProcess = (pNtSetInformationProcess)
                GetProcAddress(hNtdll, "NtSetInformationProcess");

            if (NtSetInformationProcess) {
                ULONG processBreakOnTermination = 1;
                NtSetInformationProcess(
                    GetCurrentProcess(),
                    0x1D, // ProcessBreakOnTermination
                    &processBreakOnTermination,
                    sizeof(processBreakOnTermination)
                );
            }
        }
    }

    void setupTrapFlag() {
        // Piège utilisant le flag TF
        __try {
            __asm {
                pushfd                  // Sauvegarder les flags
                or dword ptr[esp], 0x100 // Activer le trap flag
                popfd                   // Restaurer les flags
                nop                     // Instruction test
            }
        }
        __except (EXCEPTION_EXECUTE_HANDLER) {
            // Si nous arrivons ici normalement, pas de debugger
        }
    }

public:
    AntiDebugSystem() {
        setupAntiAttach();
    }

    bool detectDebugger() {
        // Vérifications basiques
        if (isBeingDebugged()) {
            std::cout << "Debugger détecté via méthodes basiques" << std::endl;
            return true;
        }

        // Vérification des fenêtres de debugger
        if (checkDebuggerWindows()) {
            std::cout << "Fenêtre de debugger détectée" << std::endl;
            return true;
        }

        // Vérification des processus de debugger
        if (checkDebuggerProcesses()) {
            std::cout << "Processus de debugger détecté" << std::endl;
            return true;
        }

        // Vérification des breakpoints hardware
        if (checkHardwareBreakpoints()) {
            std::cout << "Breakpoints hardware détectés" << std::endl;
            return true;
        }

        // Mettre en place le piège TF
        setupTrapFlag();

        return false;
    }

    void takeAction() {
        if (detectDebugger()) {
            // Actions possibles en cas de détection
            // 1. Terminer le processus
            // ExitProcess(0);

            // 2. Corrompre la mémoire
            // memset(GetModuleHandle(NULL), 0, 4096);

            // 3. Entrer dans une boucle infinie
            // while(true) Sleep(1000);

            // 4. Déclencher une exception
            // RaiseException(EXCEPTION_BREAKPOINT, 0, 0, NULL);

            // Pour l'exemple, on affiche juste un message
            std::cout << "Debugger détecté! Action défensive initiée." << std::endl;
        }
    }
};

// Exemple d'utilisation
int main() {
    AntiDebugSystem antiDebug;
    
    std::cout << "Vérification anti-debug en cours..." << std::endl;
    
    // Boucle principale
    while (true) {
        antiDebug.takeAction();
        Sleep(1000); // Vérification périodique
    }

    return 0;
}
