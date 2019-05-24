import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import Error from "./ErrorMessage";
import Table from "./styles/Table";
import SickButton from "./styles/SickButton";
import PropTypes from "prop-types";

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation UPDATE_PERMISSIONS_MUTATION(
    $permissions: [Permission]
    $userId: ID!
  ) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      name
      email
      permissions
    }
  }
`;

const ALL_USERS_QUERY = gql`
  query {
    users {
      id
      name
      email
      permissions
    }
  }
`;

const possiblePermissions = [
  "ADMIN",
  "USER",
  "ITEMCREATE",
  "ITEMUPDATE",
  "ITEMDELETE",
  "PERMISSIONUPDATE"
];

const Permissions = props => (
  <Query query={ALL_USERS_QUERY}>
    {({ data, loading, error }) => (
      <div>
        {loading && <p>Loading...</p>}
        <Error error={error} />
        <h2>Manage Permissions</h2>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              {possiblePermissions.map(permission => (
                <th key={permission}>{permission}</th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {data.users.map(user => (
              <UserPermissions user={user} key={user.id} />
            ))}
          </tbody>
        </Table>
      </div>
    )}
  </Query>
);

class UserPermissions extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      id: PropTypes.string,
      permissions: PropTypes.array
    }).isRequired
  };
  state = {
    userId: this.props.user.id,
    permissions: this.props.user.permissions
  };

  handlePermissionChange = e => {
    const checkbox = e.target;
    //take a copy of current permission
    let updatedPermissions = [...this.state.permissions];
    if (checkbox.checked) {
      //add permission
      updatedPermissions.push(checkbox.value);
    } else {
      //filter permission out of the array
      updatedPermissions = updatedPermissions.filter(
        permission => permission !== checkbox.value
      );
    }
    console.log(updatedPermissions);

    this.setState({ permissions: updatedPermissions });
  };

  render() {
    const user = this.props.user;
    return (
      <Mutation mutation={UPDATE_PERMISSIONS_MUTATION} variables={this.state}>
        {(updatePermissions, { error, loading }) => (
          <tr>
            <td>{user.name}</td>
            <td>{user.email}</td>
            {possiblePermissions.map(permission => (
              <td key={permission}>
                <label htmlFor={`${user.id}-permission-${permission}`}>
                  <input
                    id={`${user.id}-permission-${permission}`}
                    type="checkbox"
                    checked={this.state.permissions.includes(permission)}
                    value={permission}
                    onChange={this.handlePermissionChange}
                  />
                </label>
              </td>
            ))}
            <td>
              <SickButton disabled={loading} onClick={async (e) => { e.preventDefault();
                  await updatePermissions();}}>
                Updat{loading ? 'ing':'e'}
              </SickButton>
            </td>
          </tr>
        )}
      </Mutation>
    );
  }
}
export default Permissions;
