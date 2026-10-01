import { createRoot } from 'react-dom/client';
import {Test, Button} from './Test.jsx';

createRoot(document.getElementById('root')).render(
<div>
    <Test />
    <Button />
</div>

);