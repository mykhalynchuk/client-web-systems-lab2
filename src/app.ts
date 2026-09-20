import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.scss';
import { AppRenderer } from './ui/render';

document.addEventListener('DOMContentLoaded', () => {
    const app = new AppRenderer();
    app.init();
});