import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { User, WasteRequest } from "./src/types";

// Dynamic In-Memory Store
let users: User[] = [
  {
    id: "john-doe",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 00001",
    role: "user",
    rewardPoints: 1250,
    co2Saved: 124,
    treesPlanted: 86,
    waterSaved: 120,
    profilePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
  },
  {
    id: "alex-rivera",
    name: "Alex Rivera",
    email: "alex@example.com",
    phone: "+91 98765 12345",
    role: "recycler",
    rewardPoints: 0,
    co2Saved: 14200, // 14.2 Tons
    treesPlanted: 920,
    waterSaved: 8500,
    companyName: "EcoCenter Logistics",
    rating: 4.9,
    profilePhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&auto=format&fit=crop",
    earnings: 4820.50,
  }
];

// Persistent In-Memory Password Store
const userPasswords = new Map<string, string>([
  ["john.doe@example.com", "password123"],
  ["alex@example.com", "password123"]
]);

let requests: WasteRequest[] = [
  {
    id: "#REQ-001",
    userId: "john-doe",
    userName: "John Doe",
    wasteType: "Plastic",
    quantity: 15,
    pickupAddress: "MG Road, Bengaluru, Karnataka",
    contactNumber: "+91 98765 00001",
    preferredPickupDate: "2024-05-15",
    status: "Completed",
    createdAt: "2024-05-14"
  },
  {
    id: "#REQ-002",
    userId: "john-doe",
    userName: "John Doe",
    wasteType: "E-Waste",
    quantity: 4,
    pickupAddress: "MG Road, Bengaluru, Karnataka",
    contactNumber: "+91 98765 00001",
    preferredPickupDate: "2024-05-22",
    status: "Accepted",
    createdAt: "2024-05-21"
  },
  {
    id: "#REQ-003",
    userId: "john-doe",
    userName: "John Doe",
    wasteType: "Metal",
    quantity: 25,
    pickupAddress: "MG Road, Bengaluru, Karnataka",
    contactNumber: "+91 98765 00001",
    preferredPickupDate: "2024-06-01",
    status: "Pending",
    createdAt: "2024-05-30"
  },
  {
    id: "#REQ-004",
    userId: "john-doe",
    userName: "John Doe",
    wasteType: "Paper",
    quantity: 12,
    pickupAddress: "MG Road, Bengaluru, Karnataka",
    contactNumber: "+91 98765 00001",
    preferredPickupDate: "2024-06-05",
    status: "Collected",
    createdAt: "2024-06-04"
  },
  // Recycler Area General Requests (some from other users)
  {
    id: "#REQ-402",
    userId: "sarah-jenkins",
    userName: "Sarah Jenkins",
    wasteType: "E-Waste",
    quantity: 12.5,
    pickupAddress: "Bandra West, Mumbai, MH",
    contactNumber: "+91 98765 11122",
    preferredPickupDate: "2024-10-24",
    status: "Pending",
    createdAt: "2024-10-23"
  },
  {
    id: "#REQ-398",
    userId: "marcus-kaine",
    userName: "Marcus Kaine",
    wasteType: "Plastic",
    quantity: 45.0,
    pickupAddress: "Connaught Place, New Delhi",
    contactNumber: "+91 98765 33344",
    preferredPickupDate: "2024-10-23",
    status: "Accepted",
    createdAt: "2024-10-22"
  },
  {
    id: "#REQ-395",
    userId: "anita-lee",
    userName: "Anita Lee",
    wasteType: "Metal",
    quantity: 112.0,
    pickupAddress: "Okhla Industrial Area Phase-1, New Delhi",
    contactNumber: "+91 98765 55566",
    preferredPickupDate: "2024-10-22",
    status: "Collected",
    createdAt: "2024-10-21"
  },
  {
    id: "#REQ-391",
    userId: "david-horn",
    userName: "David Horn",
    wasteType: "Mixed",
    quantity: 5.2,
    pickupAddress: "Residency Road, Richmond Town, Bengaluru",
    contactNumber: "+91 98765 77788",
    preferredPickupDate: "2024-10-21",
    status: "Completed",
    createdAt: "2024-10-20"
  }
];

// Helper to generate IDs
function generateReqID(): string {
  const num = Math.floor(100 + Math.random() * 900);
  return `#REQ-${num}`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body Parsing Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Route - Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "alive", timestamp: new Date() });
  });

  // API Backend Service
  // Auth - Login
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      // Lazy auto-create if new email is used
      const name = email.split('@')[0].toUpperCase();
      user = {
        id: email.replace(/[@.]/g, "-"),
        name: name,
        email: email,
        role: "user",
        rewardPoints: 0,
        co2Saved: 0,
        treesPlanted: 0,
        waterSaved: 0,
        profilePhoto: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&auto=format&fit=crop`
      };
      users.push(user);
      userPasswords.set(email.toLowerCase(), password || "password123");
    } else {
      // Enforce password validation if password is provided or configured
      const correctPassword = userPasswords.get(email.toLowerCase()) || "password123";
      if (password && password !== correctPassword) {
        return res.status(401).json({ error: "Incorrect password for this account." });
      }
    }
    return res.json({ success: true, user });
  });

  // Auth - Register
  app.post("/api/auth/register", (req, res) => {
    const { name, email, phone, role, password } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const newUser: User = {
      id: email.replace(/[@.]/g, "-"),
      name,
      email,
      phone: phone || "+1 (555) 000-0000",
      role: role || "user",
      rewardPoints: 0,
      co2Saved: 0,
      treesPlanted: 0,
      waterSaved: 0,
      profilePhoto: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop`,
      ...(role === "recycler" ? { companyName: "EcoCenter Logistics", rating: 4.9, earnings: 0 } : {})
    };

    users.push(newUser);
    userPasswords.set(email.toLowerCase(), password || "password123");

    return res.json({ success: true, user: newUser });
  });

  // Fetch Requests
  app.get("/api/requests", (req, res) => {
    const userId = req.query.userId as string;
    const role = req.query.role as string;

    if (role === "recycler") {
      // Recyclers can see all requests
      return res.json(requests);
    }

    if (userId) {
      // Filter by owner
      const userRequests = requests.filter(r => r.userId === userId);
      return res.json(userRequests);
    }

    return res.json(requests);
  });

  // Submit Request
  app.post("/api/requests", (req, res) => {
    const { userId, wasteType, quantity, pickupAddress, contactNumber, preferredPickupDate } = req.body;

    if (!userId || !wasteType || !quantity || !pickupAddress) {
      return res.status(400).json({ error: "Missing required pickup fields" });
    }

    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newRequest: WasteRequest = {
      id: generateReqID(),
      userId,
      userName: user.name,
      wasteType,
      quantity: Number(quantity),
      pickupAddress,
      contactNumber: contactNumber || user.phone || "+1 (555) 000-0000",
      preferredPickupDate,
      status: "Pending",
      createdAt: new Date().toISOString().split('T')[0]
    };

    requests.unshift(newRequest);
    return res.json({ success: true, request: newRequest });
  });

  // Update Request Status (Accept, Mark Collected, Mark Completed)
  app.put("/api/requests/:id", (req, res) => {
    const { id } = req.params;
    const { status, recyclerId } = req.body;

    const requestIndex = requests.findIndex(r => r.id === id);
    if (requestIndex === -1) {
      return res.status(404).json({ error: "Request not found" });
    }

    const request = requests[requestIndex];
    request.status = status;

    // Award point logic for completed requests
    if (status === "Completed") {
      const user = users.find(u => u.id === request.userId);
      if (user) {
        // Point rates: 10 points/kg
        const pointsEarned = Math.round(request.quantity * 10);
        user.rewardPoints += pointsEarned;
        user.co2Saved += Math.round(request.quantity * 2.4); // 2.4kg limit
        user.waterSaved += Math.round(request.quantity * 12); // 12L limit
        user.treesPlanted += Math.round(request.quantity / 3) || 1;
      }

      // If recycler completed it, increase recycler's compiled metrics
      if (recyclerId) {
        const recycler = users.find(u => u.id === recyclerId);
        if (recycler) {
          recycler.co2Saved += Math.round(request.quantity * 2.4);
          recycler.waterSaved += Math.round(request.quantity * 12);
          recycler.treesPlanted += Math.round(request.quantity / 3) || 1;
          const pay = Number((request.quantity * 0.85).toFixed(2));
          recycler.earnings = Number(((recycler.earnings || 0) + pay).toFixed(2));
        }
      }
    }

    return res.json({ success: true, request });
  });

  // Live query search
  app.get("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const user = users.find(u => u.id === id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(user);
  });

  // Profile Update
  app.put("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const { name, phone, companyName } = req.body;

    const user = users.find(u => u.id === id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (companyName) user.companyName = companyName;

    return res.json({ success: true, user });
  });

  // Vite middleware for development or Static Asset Distribution for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
});
