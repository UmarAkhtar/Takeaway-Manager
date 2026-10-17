import Menu from './Menu.jsx';
import StaffOnly from './StaffOnly.jsx';

export default function StaffPage() {
  return (
    <StaffOnly>
      <Menu />
    </StaffOnly>
  );
}
