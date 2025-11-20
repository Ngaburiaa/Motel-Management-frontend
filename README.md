# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
| Purpose             | Tailwind Class                              | Hex Value |
| ------------------- | ------------------------------------------- | --------- |
| Primary Accent      | `text-blue-600`                             | `#2563EB` |
| Hover Accent        | `hover:text-blue-700` / `hover:bg-blue-700` | `#1D4ED8` |
| Background Gradient | `from-slate-100`                            | `#F1F5F9` |
| Background Gradient | `to-slate-200`                              | `#E2E8F0` |
| Text on Form        | `text-gray-700`                             | `#374151` |
| Light Text/Hint     | `text-gray-500`                             | `#6B7280` |
| Form Background     | `bg-white`                                  | `#FFFFFF` |

Tailwindcss, daisyUi, reactjs, react-hootk-form, typescript, lucide icons, sweetalert and react-hot-toast and modals where necessary.

my background is bg-gradient-to-br from-slate-100 to-slate-200


const links = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "booking-details", label: "Booking Details", icon: ClipboardList },
  { id: "hotels", label: "Hotels", icon: Hotel },
  { id: "ticket", label: "Customer Support", icon: MessageSquare },
];



const errorMessage = parseRTKError(err, "Subscription failed. Please try again.");
toast.error(errorMessage);



interface Props {
  mode: "add" | "edit";
  defaultValues?: Partial<HotelFormData>;
  onClose: () => void;
  onSubmit: (values: HotelFormData) => Promise<void>;
}

type Area = { width: number; height: number; x: number; y: number };

function getCroppedImg(imageSrc: string, crop: Area): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Could not get canvas context");

      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );

      resolve(canvas.toDataURL("image/jpeg"));
    };
    image.onerror = () => reject("Image load failed");
  });
}