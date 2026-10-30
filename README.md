# Installment Pro (Next.js)

Dukaandaron ke liye qiston ka hisaab. Do alag portal:

- **Shopkeeper** - `/shop/login`, `/shop/signup`, `/shop/dashboard` ...
- **Admin** - `/admin/signin`, `/admin/dashboard`, `/admin/shops`

Mobile-first (390px). Baad mein mobile app isi API par banegi.

## VS Code mein chalane ka tareeqa

1. Zip extract karein aur folder VS Code mein kholein (File > Open Folder).
2. Terminal kholein (Ctrl + `) aur chalayein:

```bash
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000
```

3. TypeScript check: `npm run lint`

Node.js 20 ya naya chahiye (`node -v` se dekhein).

## Dependencies

```bash
npm install next react react-dom sass @reduxjs/toolkit react-redux axios js-cookie react-toastify lucide-react @fontsource-variable/inter @fontsource/noto-naskh-arabic

npm install -D typescript @types/node @types/react @types/react-dom @types/js-cookie
```

Zip mein `package.json` pehle se in sab ke saath hai, to sirf `npm install` kaafi hai.

## VS Code extensions (optional)

- ESLint
- Sass (.sass only) / SCSS IntelliSense
- ES7+ React/Redux snippets

## Admin ka flow (naya)

Admin ke paas sirf do cheezein: **shops ka status** aur **monthly fee**.

- Dashboard: Active / Pending / Inactive / Archived ki ginti, is mahine ki fee (wasool, baaki, kitni shops ne di).
- Shops: search, status filter, fee filter (Paid / Unpaid), har row mein "Status badlein" menu.
- Shop detail: status kisi bhi stage se kisi bhi status par (Pending, Active, Inactive, Archived), pehle confirm box. Mahine ki fee "Paid / Unpaid mark karein".
- Fee: `Rs. 2,500` har Active dukaan ke liye.

## Shopkeeper ke naye kaam

- **Aaj ki wasooli:** jis customer ki qist poori mil jaye woh list se hat jata hai. Neeche band line "Aaj mil gaye" mein dikhta hai, wahan "Wapas karein" (undo) hai (sirf aaj ki payments ke liye, record rehta hai).
- **Delete customer:** sirf us customer ka jis ki saari qistein poori ho chuki hon. Customers ki list mein card ke dropdown (teen nuqtay) mein, aur customer ke detail page par.
- **Item ki photo:** optional, ek item par ek. Detail page par thumbnail, dabane par poori screen.
- **Phone se photo:** Camera aur Gallery dono ka option. Gallery wala normal phone picker kholta hai, is liye alag permission nahi chahiye. Photo upload se pehle chhoti (compress) ho jati hai.

## NestJS API configuration

Set `.env.local` to `NEXT_PUBLIC_BASE_URL=http://localhost:3001`. The frontend requests live backend APIs directly; shop and admin data is not supplied by demo/mock records.

API URLs are in `src/store/ApiServices/apiUrls.ts`. Responses use `{ status: "success", data: ... }`.

## Folder structure

```
src/
  app/
    (public)/            "/" -> shop login
    (auth)/shop/         login, signup
    (auth)/admin/        signin
    shop/                dashboard, collection, customers (+[id], add), late, status
    admin/               dashboard, shops (+[id])
  components/
    common/              Button, FormInput, Modal, DropdownMenu, PhotoSourceSheet, PhotoViewer ...
    shop/                Navbar, SideBar, customer-form, customer-profile, received-today ...
    admin/               Navbar, Sidebar, shops-table, shop-detail, status-control, fee-card ...
  store/                 ApiServices, slices/{shop,admin}, store.ts
  constant/              appRoutes.tsx, shopStatus.ts
  shared/  hooks/  types/  styles/  svgs/  common/Drawer
  proxy.ts               login guard (Next.js 16)
```
