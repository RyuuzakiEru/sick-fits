function Person(name, foods) {
	this.name = name;
	this.foods = foods;
}

Person.prototype.fetchFavFoods = function () {
	return new Promise((resolve, reject) => {
		setTimeout(() => resolve(this.foods), 2000);
	});
};

describe('mocking learning', () => {

	it('Can create a Person', async () => {
		const me = new Person('Wes', ['pizza', 'hamburger']);
		//mock
		me.fetchFavFoods = jest.fn().mockResolvedValue(['sushi', 'ramen']);
		const favFoods = await me.fetchFavFoods();
		console.log(favFoods);
		expect(favFoods).toContain('sushi');
	});
});
