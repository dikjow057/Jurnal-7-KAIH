import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { getGoogleSheetsClient, SHEET_ID } from "./src/services/googleSheets";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // --- Helper: Google Sheets Operations ---
  const getSheetData = async (range: string) => {
    const sheets = await getGoogleSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range,
    });
    return response.data.values;
  };

  const appendSheetData = async (range: string, values: any[]) => {
    const sheets = await getGoogleSheetsClient();
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [values] },
    });
  };

  // --- API Routes ---

  // Auth
  app.post("/api/auth/login", async (req, res) => {
    const { username, password, type } = req.body;

    if (type === 'admin') {
      if (username === 'mimin' && password === 'mimin1234') {
        return res.json({ success: true, role: 'admin', user: { name: 'Admin Mimin', role: 'admin' } });
      }
      return res.status(401).json({ success: false, message: "Username atau Password Admin salah" });
    }

    try {
      const users = await getSheetData("Users!A2:E");
      if (!users) {
        console.error("Sheet 'Users' empty or not found");
        return res.status(404).json({ success: false, message: "Database user tidak ditemukan. Pastikan tab 'Users' ada." });
      }

      const userRow = users.find(row => row[0] === username && row[3] === password);
      if (userRow) {
        return res.json({ 
          success: true, 
          role: 'student', 
          user: { nis: userRow[0], name: userRow[1], class: userRow[2], role: 'student' } 
        });
      }
      res.status(401).json({ success: false, message: "NIS atau Password salah" });
    } catch (err: any) {
      console.error("Google Sheets Connection Error:", err.message);
      res.status(500).json({ 
        success: false, 
        message: `Gagal menghubungkan ke database: ${err.message}. Periksa konfigurasi Environment Variables dan pastikan Spreadsheet sudah di-share ke Service Account.` 
      });
    }
  });

  // Jurnal 7KAIH
  app.post("/api/jurnal/7kaih", async (req, res) => {
    const data = req.body;
    try {
      await appendSheetData("Jurnal7KAIH!A2", [
        Date.now().toString(),
        data.nis,
        data.date,
        data.bangunPagi,
        data.beribadah,
        data.berolahraga,
        data.makanSehat,
        data.gemarBelajar,
        data.bermasyarakat,
        data.tidurCepat,
        new Date().toISOString()
      ]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false });
    }
  });

  // Literasi
  app.post("/api/jurnal/literasi", async (req, res) => {
    const data = req.body;
    try {
      await appendSheetData("Literasi!A2", [
        Date.now().toString(),
        data.nis,
        data.date,
        data.judulBuku,
        data.halaman,
        data.ringkasan,
        new Date().toISOString()
      ]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false });
    }
  });

  // History
  app.get("/api/history", async (req, res) => {
    const { nis } = req.query;
    try {
      const kaihRows = await getSheetData("Jurnal7KAIH!A2:K");
      const literasiRows = await getSheetData("Literasi!A2:G");

      const kaih = (kaihRows || [])
        .filter(row => row[1] === nis)
        .map(row => ({
          id: row[0], nis: row[1], date: row[2], bangunPagi: row[3],
          beribadah: row[4], berolahraga: row[5], makanSehat: row[6],
          gemarBelajar: row[7], bermasyarakat: row[8], tidurCepat: row[9],
          timestamp: row[10]
        }))
        .reverse();

      const literasi = (literasiRows || [])
        .filter(row => row[1] === nis)
        .map(row => ({
          id: row[0], nis: row[1], date: row[2], judulBuku: row[3],
          halaman: row[4], ringkasan: row[5], timestamp: row[6]
        }))
        .reverse();

      res.json({ kaih, literasi });
    } catch (err) {
      res.status(500).json({ kaih: [], literasi: [] });
    }
  });

  // Change Password
  app.post("/api/auth/change-password", async (req, res) => {
    const { nis, newPassword } = req.body;
    try {
      const sheets = await getGoogleSheetsClient();
      const users = await getSheetData("Users!A2:E");
      if (!users) return res.status(404).json({ success: false, message: "Database tidak ditemukan" });

      const rowIndex = users.findIndex(row => row[0] === nis);
      if (rowIndex === -1) return res.status(404).json({ success: false, message: "User tidak ditemukan" });

      // Update password in column D (index 3)
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `Users!D${rowIndex + 2}`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [[newPassword]] },
      });

      res.json({ success: true });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // Admin Stats (Enhanced for CSV)
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const users = await getSheetData("Users!A2:C") || [];
      const kaih = await getSheetData("Jurnal7KAIH!A2:K") || [];
      const literasi = await getSheetData("Literasi!A2:G") || [];

      const today = new Date().toISOString().split('T')[0];

      const stats = users.map(user => {
        const nis = user[0];
        const userKaih = kaih.filter(k => k[1] === nis);
        const userLiterasi = literasi.filter(l => l[1] === nis);

        const lastKaih = userKaih.length > 0 ? userKaih[userKaih.length - 1][2] : null;
        const lastLiterasi = userLiterasi.length > 0 ? userLiterasi[userLiterasi.length - 1][2] : null;

        return {
          nis,
          name: user[1],
          class: user[2],
          filledToday: lastKaih === today,
          literasiToday: lastLiterasi === today,
          lastKaih,
          lastLiterasi,
          totalKaih: userKaih.length,
          totalLiterasi: userLiterasi.length
        };
      });

      res.json(stats);
    } catch (err) {
      console.error("Admin Stats Error:", err);
      res.status(500).json([]);
    }
  });

  // Add Student
  app.post("/api/admin/add-student", async (req, res) => {
    const { nis, name, className, password } = req.body;
    try {
      // Check if student already exists
      const users = await getSheetData("Users!A2:A");
      if (users && users.some(row => row[0] === nis)) {
        return res.status(400).json({ success: false, message: "Siswa dengan NIS ini sudah ada" });
      }

      await appendSheetData("Users!A2", [
        nis,
        name,
        className,
        password,
        "" // GoogleID empty initially
      ]);
      res.json({ success: true });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

