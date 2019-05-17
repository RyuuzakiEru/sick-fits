import Link from "next/link";
import Items from '../components/Items'

const Home = props => (
  <div>
    <Link href="/sell">
      <Items page={parseFloat(props.query.page)|| 1}/>
    </Link>
  </div>
);
export default Home;
