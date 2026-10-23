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

## Demo mode (backend ke baghair)

`.env.local` mein `NEXT_PUBLIC_USE_MOCK=true` ho to data `src/store/ApiServices/mockData.ts` se aata hai.

| Portal | Login |
|---|---|
| Shopkeeper (active) | `0300-1234567` + koi bhi password |
| Shopkeeper (pending) | `0302-8899001` |
| Shopkeeper (archived) | `0303-1239874` |
| Admin | `admin@installmentpro.pk` / `Admin@123` |

## Admin ka flow (naya)

Admin ke paas sirf do cheezein: **shops ka status** aur **monthly fee**.

- Dashboard: Active / Pending / Inactive / Archived ki ginti, is mahine ki fee (wasool, baaki, kitni shops ne di).
- Shops: search, status filter, fee filter (Paid / Unpaid), har row mein "Status badlein" menu.
- Shop detail: status kisi bhi stage se kisi bhi status par (Pending, Active, Inactive, Archived), pehle confirm box. Mahine ki fee "Paid / Unpaid mark karein".
- Fee: abhi `Rs. 2,500` har Active dukaan ke liye (`mockData.ts` mein `FEE`).

## Shopkeeper ke naye kaam

- **Aaj ki wasooli:** jis customer ki qist poori mil jaye woh list se hat jata hai. Neeche band line "Aaj mil gaye" mein dikhta hai, wahan "Wapas karein" (undo) hai (sirf aaj ki payments ke liye, record rehta hai).
- **Delete customer:** sirf us customer ka jis ki saari qistein poori ho chuki hon. Customers ki list mein card ke dropdown (teen nuqtay) mein, aur customer ke detail page par.
- **Item ki photo:** optional, ek item par ek. Detail page par thumbnail, dabane par poori screen.
- **Phone se photo:** Camera aur Gallery dono ka option. Gallery wala normal phone picker kholta hai, is liye alag permission nahi chahiye. Photo upload se pehle chhoti (compress) ho jati hai.

## NestJS API se jorna

1. `.env.local`: `NEXT_PUBLIC_USE_MOCK=false` aur `NEXT_PUBLIC_BASE_URL=http://localhost:3001`
2. API ke URLs `src/store/ApiServices/apiUrls.ts` mein hain. Har response: `{ status: "success", data: ... }`
3. `mockData.ts` aur `mockAdapter.ts` delete kar dein (aur `api.ts` se `adapter` wali line).
4. Backend ke liye: customer delete **soft delete** ho, payment undo **reverse** ho (delete nahi), photos private storage mein.

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
