import { bootstrap } from "../../lib/core/bootstrap.js";
import { definition as socialLink } from "./components/nz-social-link/nz-social-link.js";
import { definition as footer } from "./components/nz-footer/nz-footer.js";
import { definition as gravatar } from "./components/nz-gravatar/nz-gravatar.js";
import { definition as layout } from "./layouts/nz-layout/nz-layout.js";
import { definition as homePage } from "./pages/nz-home/nz-home.js";

await bootstrap([socialLink, footer, layout, homePage, gravatar]);
