# FYNEST | Streetwear Essentials 🚀

**FYNEST** is a modern, Single-Page Application (SPA) e-commerce website designed for a premium streetwear brand. Built with a focus on aesthetics, smooth interactions, and portability.

## ✨ Features

- **Single File Architecture**: All core logic, styles, and data are consolidated into one `index.html` file for extreme portability.
- **SPA Navigation**: Seamless page transitions (Home, Shop, About, Store Locator) without reloading.
- **Interactive 3D Elements**: Integrated Three.js canvas for dynamic 3D mannequin displays.
- **Product Catalog**:
  - Filter by Category (T-Shirts, Outerwear, etc.)
  - Real-time Search
  - "New" and "Low Stock" Badges
- **Direct Integration**:
  - Direct "BUY NOW" links to TikTok Shop/Tokopedia.
  - Interactive Product Detail Modals.
- **Admin Panel**: Separate `admin_index.html` for managing products (Seed credentials included).

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (Modern Variables & Flexbox/Grid), Vanilla JavaScript (ES6+).
- **3D Graphics**: [Three.js](https://threejs.org/) (via CDN).
- **Icons**: SVG Icons (Phosphor/Feather style).
- **Data**: JSON-like objects embedded in JavaScript (No external database required).

## 📂 Project Structure

```bash
FYNEST/
├── index.html          # Main Application (The Website)
├── admin_index.html    # Admin Dashboard
├── admin_script.js     # Admin Logic
├── admin_style.css     # Admin Styling
├── images/             # Product Images
└── README.md           # Documentation
```

## 🚀 Getting Started

### Prerequisites
You only need a modern web browser (Chrome, Edge, Firefox, Safari).

### Installation
1.  **Clone the repository** (or download the ZIP):
    ```bash
    git clone https://github.com/yourusername/fynest-streetwear.git
    ```
2.  **Open the User App**:
    - Simply double-click `index.html` to open it in your browser.
3.  **Open the Admin Panel**:
    - Double-click `admin_index.html`.
    - **Default Credentials**:
      - Username: `wili`
      - Password: `wiliam`

## 🛒 Usage

1.  **Shop**: Browse products on the home page. Use the category pills to filter.
2.  **Detail**: Click any product card to view the detail modal.
3.  **Buy**: Click **"BUY NOW"** to be redirected to the official store (TikTok Shop/Tokopedia).
4.  **Admin**: Log in to add new products or edit existing ones. Changes are saved to `localStorage`.

## 🤝 Contributing

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Created by [Your Name] for FYNEST Brand.*
