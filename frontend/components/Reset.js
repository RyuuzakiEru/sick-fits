import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import { CURRENT_USER_QUERY } from "./User";

const RESET_PASSWORD_MUTATION = gql`
  mutation RESET_PASSWORD_MUTATION(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      name
      email
    }
  }
`;

class Reset extends Component {
  state = {
    resetToken: this.props.resetToken,
    password: "",
    confirmPassword: ""
  };

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <Mutation
        mutation={RESET_PASSWORD_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(resetPassword, { data, error, loading }) => (
          <Form
            method="POST"
            onSubmit={async e => {
              e.preventDefault();
              await resetPassword();
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <Error error={error} />
              {data && <p>Success!!</p>}
              <h2>¿Forgot your password?</h2>
              <label htmlFor="password">
                Enter new Password
                <input
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  required
                  value={this.state.password}
                  onChange={this.saveToState}
                />
              </label>
              <label htmlFor="confirmPassword">
                Confirm your Password
                <input
                  type="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  required
                  value={this.state.confirmPassword}
                  onChange={this.saveToState}
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
export default Reset;
