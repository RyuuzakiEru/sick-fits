import React, { Component } from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";

import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";
import Error from "./ErrorMessage";
import Router from "next/router";

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;

// Create mutation and define inputs, these will match input names in for for easy deconstruct
const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`;

class UpdateItem extends Component {
  //initial state to store form temporary values
  state = {
      item: {}
  };

  handleChange = e => {
    // we handle change by storing into state
    const { name, type, value } = e.target;
    const val = type === "number" ? parseFloat(value) : value;
    //console.log( {name, val} );
    this.setState({ [name]: val });
  };

  updateItem = async (e, updateItemMutation ) => {
    e.preventDefault();
    console.log('update Item')
    console.log(this.state);
    const res = await updateItemMutation( {
        variables: {
            id: this.props.id,
            ...this.state,
        }
    });


  };

  uploadFile = async e => {
    console.log("Uploading File...");
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "sick-fits");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/ryuuzaki/image/upload",
      {
        method: "POST",
        body: data
      }
    );
    //console.log(res);
    const file = await res.json();
    console.log(file);
    this.setState({
      image: file.secure_url,
      largerImage: file.eager[0].secure_url
    });
  };
  render() {
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
        {({ data, loading }) => {
          if (loading) return <p>Loading...</p>;
          if (!data.item) return <p>No item found for ID: {this.props.id}</p>
          return (
            //Mutation receives state, being constantly updated and having matching names this is less work
            <Mutation
              mutation={UPDATE_ITEM_MUTATION}
              variables={this.state}
            >
              {(updateItem, { loading, error}) => (
                <Form onSubmit = { e => this.updateItem(e, updateItem ) } >
                  {
                    //Apollo Mutation will keep error and loading variables updated for us, so we can auto apply loading state to fieldset and display any potential errors in UI
                  }
                  <Error error={error} />
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="title">
                      Title
                      <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Title"
                        required
                        defaultValue={data.item.title}
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
                        value={data.item.price}
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
                        value={data.item.description}
                        onChange={this.handleChange}
                      />
                    </label>
                    <button type="submit">Save Changes</button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default UpdateItem;
export { UPDATE_ITEM_MUTATION };
