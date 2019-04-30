import Link from "next/link";
import Items from '../components/Items'

const Home = props => (
  <div>
    <Link href="/sell">
      <Items />
    </Link>
  </div>
);
export default Home;
