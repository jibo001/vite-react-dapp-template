import { Button } from 'antd-mobile';
import { Link } from 'react-router-dom';

const Hello = () => (
  <div>
    <Link to="/home">
      <Button>Home</Button>
    </Link>
    <div>Hello</div>
  </div>
);

export default Hello;
