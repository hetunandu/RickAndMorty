import React, { Component, Fragment } from 'react';
import { FlatList } from 'react-native';
import { SearchBar, ListItem } from 'react-native-elements';
import { fetchItemsUrl, searchItemsUrl } from '../constants';

type Item = {
  id: number,
  name: string,
  status: string,
  image: string,
}

interface State {
  items: Array<Item>,
  searchTerm: string,
  searchResults: Array<Item>,
  nextPage: number,
}

interface Props {}

class SearchableCharacterList extends Component<Props, State> {
  constructor(props: Props){
    super(props);
    this.state = {
      items: [],
      searchTerm: '',
      searchResults: [],
      nextPage: 1,
    }
    this.fetchItems = this.fetchItems.bind(this);
    this.handleSearchChangeText = this.handleSearchChangeText.bind(this);
    this.handleSearchClear = this.handleSearchClear.bind(this);
    this.searchItems = this.searchItems.bind(this);
    this.renderListItem = this.renderListItem.bind(this);
  }
  componentDidMount() {
    this.fetchItems();
  }
  handleSearchChangeText(searchTerm: string) {
    this.setState({ searchTerm }, () => {
      if(searchTerm) {
        this.searchItems()
      }
    })
  }
  handleSearchClear() {
    this.setState({
      searchResults: [],
    })
  }
  async searchItems() {
    const { searchTerm } = this.state;
    const response = await fetch(searchItemsUrl(encodeURI(searchTerm)))
    const data = await response.json();
    if (data.error) {
      this.handleSearchClear()
    } else {
      this.setState({
        searchResults: data.results,
      })
    }
  }
  async fetchItems() {
    const { nextPage, items } = this.state;
    const response = await fetch(fetchItemsUrl(nextPage))
    const data = await response.json();
    if (data.error) {
      console.error(data.error);
    } else {
      this.setState({
        items: [...items, ...data.results],
        nextPage: nextPage + 1,
      })
    }
    
  }
  renderListItem({ item }: { item: Item }) {
    return (
      <ListItem
        title={item.name}
        subtitle={item.status}
        leftAvatar={{ 
          title: item.name[0], 
          source: { uri: item.image } }
        }
      />
    )
  }
  render() {
    const { items, searchTerm, searchResults } = this.state;
    return (
      <Fragment>
        <SearchBar 
          placeholder="Search..."
          value={searchTerm}
          onChangeText={this.handleSearchChangeText}
          onClear={this.handleSearchClear}
          lightTheme
        />
        {searchResults.length ? (
          <FlatList
            keyExtractor={item => `${item.id}`}
            data={searchResults}
            renderItem={this.renderListItem}
          />
        ) : (
          <FlatList
            keyExtractor={item => `${item.id}`}
            data={items}
            renderItem={this.renderListItem}
            onEndReached={this.fetchItems}
            onEndReachedThreshold={2}
          />
        )}
      </Fragment>
    )
  }
}

export default SearchableCharacterList;