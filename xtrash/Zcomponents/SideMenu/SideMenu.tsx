import { Link } from 'react-router-dom';

const SideMenu = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Главная</Link>
        </li>
        <li>
          <Link to="/catalog">Каталог</Link>
        </li>
        <li>
          <Link to="/profile">Профиль</Link>
        </li>
      </ul>
    </nav>
  );
};

export default SideMenu;