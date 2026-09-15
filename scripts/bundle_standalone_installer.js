import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import zlib from 'zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const downloadsDir = path.resolve(rootDir, 'public', 'downloads');

console.log('📦 Step 1: Building production bundle with Vite...');
execSync('npm.cmd run build', { cwd: rootDir, stdio: 'inherit' });

console.log('📦 Step 2: Compiling GirionixAI.exe and Uninstall_Girionix_AI.exe...');
const cscPath = 'C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe';

execSync(`"${cscPath}" /target:winexe /win32icon:app.ico /out:GirionixAI.exe GirionixApp.cs`, {
  cwd: downloadsDir,
  stdio: 'inherit'
});

execSync(`"${cscPath}" /target:winexe /win32icon:app.ico /out:Uninstall_Girionix_AI.exe GirionixUninstaller.cs`, {
  cwd: downloadsDir,
  stdio: 'inherit'
});

console.log('📦 Step 3: Packing all production assets into Embedded Payload...');

function getAllFiles(dirPath, arrayOfFiles = [], baseDir = dirPath) {
  const files = fs.readdirSync(dirPath);
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'downloads' && file !== 'node_modules' && file !== 'videos') {
        getAllFiles(fullPath, arrayOfFiles, baseDir);
      }
    } else {
      const relPath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
      arrayOfFiles.push({ fullPath, relPath });
    }
  });
  return arrayOfFiles;
}

const distFiles = getAllFiles(distDir);
console.log(`Found ${distFiles.length} distribution files to bundle into standalone installer.`);

// Read each file and compress to Base64
const payloadMap = {};
for (const file of distFiles) {
  const content = fs.readFileSync(file.fullPath);
  const compressed = zlib.gzipSync(content);
  payloadMap[file.relPath] = compressed.toString('base64');
}

// Add GirionixAI.exe, Uninstall_Girionix_AI.exe and app.ico to payloadMap
const binaryFiles = ['GirionixAI.exe', 'Uninstall_Girionix_AI.exe', 'app.ico'];
for (const binName of binaryFiles) {
  const binPath = path.join(downloadsDir, binName);
  if (fs.existsSync(binPath)) {
    const content = fs.readFileSync(binPath);
    const compressed = zlib.gzipSync(content);
    payloadMap['__bin__/' + binName] = compressed.toString('base64');
  }
}

// Generate C# Code with Embedded Payload Dictionary
const payloadJson = JSON.stringify(payloadMap);
// Split payload into chunks if large
const payloadChunks = [];
const chunkSize = 60000;
for (let i = 0; i < payloadJson.length; i += chunkSize) {
  payloadChunks.push(payloadJson.slice(i, i + chunkSize));
}

const csharpChunks = payloadChunks.map(c => `            sb.Append(@"${c.replace(/"/g, '""')}");`).join('\n');

const setupWizardTemplate = `using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.IO.Compression;
using System.Runtime.InteropServices;
using System.Text;
using System.Windows.Forms;
using Microsoft.Win32;

namespace GirionixAIInstaller
{
    public class SetupForm : Form
    {
        private ProgressBar progressBar;
        private Label lblStatus;
        private Button btnInstall;
        private Button btnCancel;
        private TextBox txtInstallPath;
        private CheckBox chkDesktopShortcut;
        private CheckBox chkLaunchAfter;
        private System.Windows.Forms.Timer timer;
        private int installProgress = 0;
        private string installDir;
        private string dataDir;

        public SetupForm()
        {
            this.Text = "Girionix AI Pro — 100% Standalone Setup Wizard";
            this.Size = new Size(580, 420);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.MinimizeBox = true;
            this.BackColor = Color.FromArgb(10, 12, 20);
            this.ForeColor = Color.White;
            this.Font = new Font("Segoe UI", 9F, FontStyle.Regular);

            string icoPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "app.ico");
            if (File.Exists(icoPath))
            {
                try { this.Icon = new Icon(icoPath); } catch { }
            }

            installDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"Girionix AI");
            dataDir = Path.Combine(installDir, "Data");

            InitializeComponents();
        }

        private void InitializeComponents()
        {
            // Header Banner
            Panel pnlHeader = new Panel();
            pnlHeader.Dock = DockStyle.Top;
            pnlHeader.Height = 80;
            pnlHeader.BackColor = Color.FromArgb(16, 20, 32);

            Label lblTitle = new Label();
            lblTitle.Text = "Girionix AI Pro Standalone Setup";
            lblTitle.Font = new Font("Segoe UI", 14F, FontStyle.Bold);
            lblTitle.ForeColor = Color.FromArgb(0, 240, 255);
            lblTitle.Location = new Point(22, 16);
            lblTitle.AutoSize = true;
            pnlHeader.Controls.Add(lblTitle);

            Label lblSubtitle = new Label();
            lblSubtitle.Text = "100% Self-Contained Desktop AI Workstation • No Website/Server Needed";
            lblSubtitle.Font = new Font("Segoe UI", 8.5F, FontStyle.Regular);
            lblSubtitle.ForeColor = Color.FromArgb(160, 175, 200);
            lblSubtitle.AutoSize = true;
            lblSubtitle.Location = new Point(22, 45);
            pnlHeader.Controls.Add(lblSubtitle);

            this.Controls.Add(pnlHeader);

            // Install Path Selection
            Label lblPathDesc = new Label();
            lblPathDesc.Text = "Installation Directory:";
            lblPathDesc.Location = new Point(25, 105);
            lblPathDesc.AutoSize = true;
            lblPathDesc.ForeColor = Color.FromArgb(200, 210, 230);
            this.Controls.Add(lblPathDesc);

            txtInstallPath = new TextBox();
            txtInstallPath.Text = installDir;
            txtInstallPath.Location = new Point(25, 130);
            txtInstallPath.Size = new Size(515, 25);
            txtInstallPath.BackColor = Color.FromArgb(22, 27, 42);
            txtInstallPath.ForeColor = Color.White;
            txtInstallPath.BorderStyle = BorderStyle.FixedSingle;
            this.Controls.Add(txtInstallPath);

            // Options
            chkDesktopShortcut = new CheckBox();
            chkDesktopShortcut.Text = "Create Desktop & Start Menu Shortcuts (.lnk)";
            chkDesktopShortcut.Checked = true;
            chkDesktopShortcut.Location = new Point(25, 170);
            chkDesktopShortcut.AutoSize = true;
            chkDesktopShortcut.ForeColor = Color.FromArgb(220, 230, 245);
            this.Controls.Add(chkDesktopShortcut);

            chkLaunchAfter = new CheckBox();
            chkLaunchAfter.Text = "Launch Girionix AI Pro standalone app immediately";
            chkLaunchAfter.Checked = true;
            chkLaunchAfter.Location = new Point(25, 200);
            chkLaunchAfter.AutoSize = true;
            chkLaunchAfter.ForeColor = Color.FromArgb(220, 230, 245);
            this.Controls.Add(chkLaunchAfter);

            // Progress Bar
            progressBar = new ProgressBar();
            progressBar.Location = new Point(25, 240);
            progressBar.Size = new Size(515, 22);
            progressBar.Visible = false;
            this.Controls.Add(progressBar);

            lblStatus = new Label();
            lblStatus.Text = "Ready to install 100% standalone Girionix AI Pro with embedded engine.";
            lblStatus.Location = new Point(25, 270);
            lblStatus.AutoSize = true;
            lblStatus.ForeColor = Color.FromArgb(0, 229, 255);
            this.Controls.Add(lblStatus);

            // Bottom Buttons
            Panel pnlBottom = new Panel();
            pnlBottom.Dock = DockStyle.Bottom;
            pnlBottom.Height = 60;
            pnlBottom.BackColor = Color.FromArgb(12, 15, 25);

            btnInstall = new Button();
            btnInstall.Text = "Install Now";
            btnInstall.Size = new Size(110, 34);
            btnInstall.Location = new Point(315, 13);
            btnInstall.BackColor = Color.FromArgb(0, 180, 216);
            btnInstall.ForeColor = Color.Black;
            btnInstall.Font = new Font("Segoe UI", 9F, FontStyle.Bold);
            btnInstall.FlatStyle = FlatStyle.Flat;
            btnInstall.FlatAppearance.BorderSize = 0;
            btnInstall.Cursor = Cursors.Hand;
            btnInstall.Click += new EventHandler(BtnInstall_Click);
            pnlBottom.Controls.Add(btnInstall);

            btnCancel = new Button();
            btnCancel.Text = "Cancel";
            btnCancel.Size = new Size(95, 34);
            btnCancel.Location = new Point(445, 13);
            btnCancel.BackColor = Color.FromArgb(30, 36, 50);
            btnCancel.ForeColor = Color.White;
            btnCancel.FlatStyle = FlatStyle.Flat;
            btnCancel.FlatAppearance.BorderSize = 0;
            btnCancel.Cursor = Cursors.Hand;
            btnCancel.Click += (s, e) => this.Close();
            pnlBottom.Controls.Add(btnCancel);

            this.Controls.Add(pnlBottom);

            timer = new System.Windows.Forms.Timer();
            timer.Interval = 20;
            timer.Tick += new EventHandler(Timer_Tick);
        }

        private void BtnInstall_Click(object sender, EventArgs e)
        {
            btnInstall.Enabled = false;
            txtInstallPath.Enabled = false;
            chkDesktopShortcut.Enabled = false;
            chkLaunchAfter.Enabled = false;

            progressBar.Visible = true;
            progressBar.Value = 0;
            lblStatus.Text = "Extracting embedded standalone application bundle...";

            installDir = txtInstallPath.Text;
            if (!Directory.Exists(installDir))
            {
                try { Directory.CreateDirectory(installDir); } catch { }
            }
            if (!Directory.Exists(dataDir))
            {
                try { Directory.CreateDirectory(dataDir); } catch { }
            }

            timer.Start();
        }

        private void Timer_Tick(object sender, EventArgs e)
        {
            installProgress += 10;
            if (installProgress <= 100)
            {
                progressBar.Value = Math.Min(100, installProgress);

                if (installProgress == 30)
                    lblStatus.Text = "Unpacking standalone HTML5/JS engine and neural UI...";
                else if (installProgress == 60)
                    lblStatus.Text = @"Configuring Local Disk Vault at %LocalAppData%\Girionix AI\Data...";
                else if (installProgress == 80)
                    lblStatus.Text = "Creating Start Menu folder and Desktop shortcuts...";
                else if (installProgress >= 100)
                {
                    timer.Stop();
                    CompleteInstallation();
                }
            }
        }

        private void CreateWindowsShortcut(string shortcutPath, string targetExePath, string iconPath, string description)
        {
            try
            {
                Type shellType = Type.GetTypeFromProgID("WScript.Shell");
                if (shellType != null)
                {
                    dynamic shell = Activator.CreateInstance(shellType);
                    dynamic shortcut = shell.CreateShortcut(shortcutPath);
                    shortcut.TargetPath = targetExePath;
                    shortcut.WorkingDirectory = Path.GetDirectoryName(targetExePath);
                    shortcut.WindowStyle = 1;
                    shortcut.Description = description;
                    if (File.Exists(iconPath))
                    {
                        shortcut.IconLocation = iconPath + ",0";
                    }
                    else
                    {
                        shortcut.IconLocation = targetExePath + ",0";
                    }
                    shortcut.Save();
                }
            }
            catch { }
        }

        private void DecompressGzip(byte[] gzipData, string targetFile)
        {
            string dir = Path.GetDirectoryName(targetFile);
            if (!Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir);
            }

            using (MemoryStream ms = new MemoryStream(gzipData))
            using (GZipStream gz = new GZipStream(ms, CompressionMode.Decompress))
            using (FileStream fs = File.Create(targetFile))
            {
                byte[] buffer = new byte[8192];
                int read;
                while ((read = gz.Read(buffer, 0, buffer.Length)) > 0)
                {
                    fs.Write(buffer, 0, read);
                }
            }
        }

        private string GetPayloadJson()
        {
            StringBuilder sb = new StringBuilder();
${csharpChunks}
            return sb.ToString();
        }

        private void CompleteInstallation()
        {
            try
            {
                string appDir = Path.Combine(installDir, "app");
                if (!Directory.Exists(appDir))
                {
                    Directory.CreateDirectory(appDir);
                }

                // Extract all embedded files
                string json = GetPayloadJson();
                // Simple JSON parser for string-to-string dictionary
                int idx = 0;
                while ((idx = json.IndexOf('"', idx)) != -1)
                {
                    int keyEnd = json.IndexOf('"', idx + 1);
                    if (keyEnd == -1) break;
                    string key = json.Substring(idx + 1, keyEnd - idx - 1);

                    int valStart = json.IndexOf('"', keyEnd + 2);
                    if (valStart == -1) break;
                    int valEnd = json.IndexOf('"', valStart + 1);
                    if (valEnd == -1) break;
                    string base64Val = json.Substring(valStart + 1, valEnd - valStart - 1);

                    try
                    {
                        byte[] gzipBytes = Convert.FromBase64String(base64Val);
                        if (key.StartsWith("__bin__/"))
                        {
                            string binFileName = key.Substring(8);
                            string targetPath = Path.Combine(installDir, binFileName);
                            DecompressGzip(gzipBytes, targetPath);
                        }
                        else
                        {
                            string targetPath = Path.Combine(appDir, key.Replace('/', Path.DirectorySeparatorChar));
                            DecompressGzip(gzipBytes, targetPath);
                        }
                    }
                    catch { }

                    idx = valEnd + 1;
                }

                string exePath = Path.Combine(installDir, "GirionixAI.exe");
                string uninstallerPath = Path.Combine(installDir, "Uninstall_Girionix_AI.exe");
                string icoPath = Path.Combine(installDir, "app.ico");

                // Clean up any old HTML/BAT shortcuts
                string desktopDir = Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory);
                string oldUrlShortcut = Path.Combine(desktopDir, "Girionix AI.url");
                string oldBatShortcut = Path.Combine(desktopDir, "Girionix AI.bat");
                try { if (File.Exists(oldUrlShortcut)) File.Delete(oldUrlShortcut); } catch { }
                try { if (File.Exists(oldBatShortcut)) File.Delete(oldBatShortcut); } catch { }

                string startMenuDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.StartMenu), "Programs");
                string oldStartUrl = Path.Combine(startMenuDir, "Girionix AI.url");
                string oldStartBat = Path.Combine(startMenuDir, "Girionix AI.bat");
                try { if (File.Exists(oldStartUrl)) File.Delete(oldStartUrl); } catch { }
                try { if (File.Exists(oldStartBat)) File.Delete(oldStartBat); } catch { }

                // Create REAL .lnk Windows Application Shortcuts
                if (chkDesktopShortcut.Checked)
                {
                    string lnkPath = Path.Combine(desktopDir, "Girionix AI.lnk");
                    CreateWindowsShortcut(lnkPath, exePath, icoPath, "Girionix AI Pro • Think • Create • Explore");
                }

                if (Directory.Exists(startMenuDir))
                {
                    // 1. Root Start Menu Shortcut
                    string startLnkPath = Path.Combine(startMenuDir, "Girionix AI.lnk");
                    CreateWindowsShortcut(startLnkPath, exePath, icoPath, "Girionix AI Pro • Think • Create • Explore");

                    // 2. Dedicated Start Menu Folder: "Girionix AI" containing "Girionix AI" and "Uninstall Girionix AI"
                    string startMenuFolder = Path.Combine(startMenuDir, "Girionix AI");
                    try
                    {
                        if (!Directory.Exists(startMenuFolder))
                        {
                            Directory.CreateDirectory(startMenuFolder);
                        }

                        string folderAppLnk = Path.Combine(startMenuFolder, "Girionix AI.lnk");
                        CreateWindowsShortcut(folderAppLnk, exePath, icoPath, "Girionix AI Pro");

                        string folderUninstLnk = Path.Combine(startMenuFolder, "Uninstall Girionix AI.lnk");
                        CreateWindowsShortcut(folderUninstLnk, uninstallerPath, icoPath, "Uninstall Girionix AI Pro");
                    }
                    catch { }
                }

                // Register in Windows Add/Remove Programs (Control Panel / Settings)
                try
                {
                    using (RegistryKey uninstKey = Registry.CurrentUser.CreateSubKey(@"Software\Microsoft\Windows\CurrentVersion\Uninstall\GirionixAI"))
                    {
                        if (uninstKey != null)
                        {
                            uninstKey.SetValue("DisplayName", "Girionix AI Pro");
                            uninstKey.SetValue("DisplayVersion", "2.0.0");
                            uninstKey.SetValue("Publisher", "Abhinav Giri (@abhinavgiri45)");
                            uninstKey.SetValue("DisplayIcon", icoPath);
                            uninstKey.SetValue("UninstallString", (char)34 + uninstallerPath + (char)34);
                            uninstKey.SetValue("InstallLocation", installDir);
                            uninstKey.SetValue("URLInfoAbout", "https://x.com/AbhinavGiri45");
                            uninstKey.SetValue("NoModify", 1, RegistryValueKind.DWord);
                            uninstKey.SetValue("NoRepair", 1, RegistryValueKind.DWord);
                        }
                    }
                }
                catch { }

                lblStatus.Text = "✅ Installation Complete! 100% Standalone App Installed.";
                btnInstall.Text = "Finish";
                btnInstall.Enabled = true;
                btnInstall.BackColor = Color.FromArgb(0, 229, 255);
                btnInstall.Click -= BtnInstall_Click;
                btnInstall.Click += (s, e) =>
                {
                    if (chkLaunchAfter.Checked)
                    {
                        try
                        {
                            Process.Start(exePath);
                        }
                        catch { }
                    }
                    this.Close();
                };
            }
            catch (Exception ex)
            {
                lblStatus.Text = "Notice: " + ex.Message;
                btnInstall.Text = "Close";
                btnInstall.Enabled = true;
            }
        }
    }

    static class Program
    {
        [STAThread]
        static void Main()
        {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new SetupForm());
        }
    }
}
`;

fs.writeFileSync(path.join(downloadsDir, 'GirionixSetupWizard.cs'), setupWizardTemplate, 'utf8');

console.log('📦 Step 4: Compiling 100% Standalone Girionix_AI_Setup.exe...');
execSync(`"${cscPath}" /target:winexe /win32icon:app.ico /out:Girionix_AI_Setup.exe GirionixSetupWizard.cs`, {
  cwd: downloadsDir,
  stdio: 'inherit'
});

console.log('✨ All 100% standalone native binaries compiled successfully!');
