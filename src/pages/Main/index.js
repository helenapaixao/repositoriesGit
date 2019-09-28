import React, { Component } from 'react';
import { FaGitAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import {Link} from 'react-router-dom'
import api from '../../services/api';
import { Form, SubmitButton, List } from './styles';
import Container from '../../components/Container';


export default class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
  };
  //carregar os dados do localStorage
  componentDidMount() {
    const repositories = localStorage.getItem('repositories');
    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;
    if (prevState.repositories !== this.state.repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value });
  };

  handleSumit = async e => {
    e.preventDefault();
    this.setState({ loading: true });
    console.log(this.state.newRepo);

    const { newRepo, repositories } = this.state;
    const response = await api.get(`/repos/${newRepo}`);

    const data = {
      name: response.data.full_name,
    };
    this.setState({
      repositories: [...repositories, data],
      newRepo: '',
      loading: false,
    });
  };
  render() {
    const { newRepo, repositories, loading } = this.state;
    return (
      <Container>
        <h1>
          <FaGitAlt />
          Repositório
        </h1>
        <Form onSubmit={this.handleSumit}>
          <input type="text" placeholder="Adicionar repositório" value={newRepo} onChange={this.handleInputChange} />
          <SubmitButton loading={loading}>
            {loading ? <FaSpinner color="#FFF" size={14} /> : <FaPlus color="#FFF" size={14} />}
          </SubmitButton>
        </Form>
        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>Detalhes</Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
