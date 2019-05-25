import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";
import Error from "./ErrorMessage";
import Router from "next/router";

// Create mutation and define inputs, these will match input names in for for easy deconstruct
const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

class CreateItem extends Component {
  //initial state to store form temporary values
  state = {
    title: "",
    description: "",
    image: "",
    largeImage: "",
    price: 0
  };

  handleChange = e => {
    // we handle change by storing into state
    const { name, type, value } = e.target;
    const val = type === "number" ? parseFloat(value) : value;
    //console.log( {name, val} );
    this.setState({ [name]: val });
  };

  uploadFile = async e => {

    const files = e.target.files;
    console.log(files);
    //check cancel button
    if (files.length === 0 ) return;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "sick-fits");
    const res = await fetch(
      'https://api.cloudinary.com/v1_1/ryuuzaki/image/upload',
      {
        method: 'POST',
        body: data
      }
    );
    //console.log(res);
    const file = await res.json();
    this.setState({
      image: file.secure_url,
      largeImage:
        (file.eager && file.eager[0].secure_url) || this.state.largeImage
    });
  };
  render() {
    return (
      //Mutation receives state, being constantly updated and having matching names this is less work
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, { loading, error, called, data }) => (
          <Form
            onSubmit={async e => {
              e.preventDefault();
              // fire off mutation query
              const res = await createItem();
              console.log(res);
              Router.push({
                pathname: "/item",
                query: { id: res.data.createItem.id }
              });
            }}
          >
            {
              //Apollo Mutation will keep error and loading variables updated for us, so we can auto apply loading state to fieldset and display any potential errors in UI
            }
            <Error error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="file">
                Image
                <input
                  type="file"
                  id="file"
                  name="file"
                  placeholder="Upload an Image"
                  onChange={this.uploadFile}
                />
                {this.state.image && <img src={this.state.image} alt={this.state.title} />}
              </label>
              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Title"
                  required
                  value={this.state.title}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor="price">
                Price
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Price"
                  required
                  value={this.state.price}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor="description">
                Description
                <textarea
                  type="text"
                  id="description"
                  name="description"
                  placeholder="Enter a Description"
                  required
                  value={this.state.description}
                  onChange={this.handleChange}
                />
              </label>
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };
