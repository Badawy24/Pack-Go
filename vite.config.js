import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    root: 'public',
    build: {
        outDir: '../dist',
        assetsDir: 'assets',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'public/index.html'),
                shop: resolve(__dirname, 'public/shop.html'),
                user: resolve(__dirname, 'public/user.html'),
                history: resolve(__dirname, 'public/history.html'),
                productDetails: resolve(__dirname, 'public/productDetails.html'),
                cart: resolve(__dirname, 'public/cart.html'),
                category: resolve(__dirname, 'public/category.html'),
                loginForm: resolve(__dirname, 'public/auth/loginForm.html'),
                dashboard: resolve(__dirname, 'public/dashboard.html'),
            },
        },
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'public')
        }
    }
}) 