# FSH_Traders

A modern e-commerce platform built with Next.js, Firebase, and Tailwind CSS.

## 🚀 Features

### Core E-commerce Features
- **Product Catalog** with category filtering
- **Shopping Cart** with real-time updates
- **User Authentication** with Firebase Auth
- **Order Management** with status tracking
- **Admin Panel** for product and order management

### Advanced Features
- **Email Notifications** for orders and newsletters
- **Product Reviews & Ratings** system
- **Responsive Design** for all devices
- **Real-time Data** with Firestore
- **Image Gallery** for product details
- **Search & Filter** functionality

### Admin Features
- **Product Management** (Add, Edit, Delete)
- **Order Tracking** with status updates
- **User Management** with role control
- **Analytics Dashboard** for insights
- **Category Management** with images

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Email**: Nodemailer
- **Icons**: React Icons
- **Deployment**: Vercel (recommended)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/devshahzaibali/FSH_Traders.git
   cd FSH_Traders
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project
   - Enable Firestore, Authentication, and Storage
   - Add your Firebase config to `src/firebase.ts`

4. **Set up environment variables**
   ```bash
   # Create .env.local file
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── catalog/           # Product catalog
│   ├── product/           # Product details
│   ├── cart/              # Shopping cart
│   └── api/               # API routes
├── components/            # Reusable components
├── data/                  # Static data files
├── firebase.ts           # Firebase configuration
└── types/                # TypeScript type definitions
```

## 🎯 Key Components

### Authentication
- **AuthContext**: Manages user authentication state
- **Login/Register**: User authentication forms
- **Protected Routes**: Role-based access control

### E-commerce
- **Product Catalog**: Browse products by category
- **Shopping Cart**: Add/remove items with quantity control
- **Checkout Process**: Order confirmation with email notifications
- **Product Details**: Rich product pages with image galleries

### Admin Panel
- **Product Management**: CRUD operations for products
- **Order Management**: Track and update order status
- **User Management**: Manage user roles and permissions
- **Analytics**: Sales and user analytics

## 📧 Email Features

The platform includes comprehensive email notifications:
- **Newsletter Subscription**: Welcome emails for new subscribers
- **Order Confirmation**: Detailed order receipts
- **Cart Checkout**: Reminder emails for abandoned carts

## 🎨 UI/UX Features

- **Responsive Design**: Works on all devices
- **Dark/Light Mode**: Theme switching capability
- **Loading States**: Smooth loading animations
- **Error Handling**: User-friendly error messages
- **Accessibility**: WCAG compliant components

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the project: `npm run build`
2. Start production server: `npm start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Shah Zaib Ali**
- GitHub: [@devshahzaibali](https://github.com/devshahzaibali)
- Email: [your-email@example.com]

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Firebase for the backend services
- Tailwind CSS for the styling system
- Unsplash for the demo images

---

**FSH_Traders** - Your complete e-commerce solution! 🛒✨
#   F S H _ T r a d e r s  
 