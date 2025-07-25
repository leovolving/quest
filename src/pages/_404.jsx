import { Link } from 'react-router-dom';

import { Button } from '../components/_ds';

const _404 = () => (
  <main>
    <h2>Page not found</h2>
    <Button as={Link} to="/">
      Home
    </Button>
  </main>
);

export default _404;
