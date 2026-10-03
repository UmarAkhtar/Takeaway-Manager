import { createRoot } from 'react-dom/client';
import {Test, Button, ShowMenu} from './Test.jsx';
import './styles.css';


createRoot(document.getElementById('root')).render(
<div>
    <Test />
    <Button />
    <ShowMenu />
</div>

);