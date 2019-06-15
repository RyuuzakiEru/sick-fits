import ItemComponent from '../components/Item';
import {shallow} from 'enzyme';
import toJSON from 'enzyme-to-json';

const fakeItem = {
	id: '2wefvwer',
	title: 'Test Item component',
	price: 5000,
	description: 'This item should work as expected',
	image: 'image.jpg',
	largeImage: 'largeImage.jpg'
};

describe('<Item />', () => {
	it('Renders and matches the snapshot', () => {
		const wrapper = shallow(<ItemComponent item={fakeItem}/>);
		expect(toJSON(wrapper)).toMatchSnapshot();

	});
});
