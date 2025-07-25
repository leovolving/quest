import { Link } from 'react-router-dom';

import { Button } from './Button';

export const RouterLink = (props) => <Button as={Link} {...props} />;
