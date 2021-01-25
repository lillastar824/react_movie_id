import React, { Component } from "react";
import axios from "axios";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

class Movies extends Component {
  state = {
    list: [],
    watchlist: [],
    unwatchlist: [],
    loading:true,
    movieid:'',
    input:''
  };

  componentDidMount() {
    // let getUnwatchlist=JSON.parse(localStorage.getItem('unwatchlist'));
    // if(getUnwatchlist.length>0)
    // {

    //     this.setState({
    //         unwatchlist: [...this.state.unwatchlist, getUnwatchlist],
    //     });
    // }
    // console.log(this.state.unwatchlist)
    const url ="https://api.themoviedb.org/3/movie/popular?api_key=6746f6929012b85e6d698792f3496740&language=en-US&page=1";
    axios
      .get(url)
      .then((response) => response.data)
      .then((data) => {
        this.setState({ list: data });
      });

    
  }
  addWatchlist = () => {    
    if(this.state.movieid!=''){
        const obj = {'id':this.state.movieid};
        this.setState({
            unwatchlist: [...this.state.unwatchlist, obj],
        });
        
        //this.setState(prevState => ({ unwatchlist: prevState.unwatchlist.set('id',this.state.movieid) }));
        localStorage.setItem("unwatchlist", JSON.stringify(this.state.unwatchlist));
         
    }
    else
        alert('select movie')
    this.setState({movieid:''})   
  };

  addWatchlistCheck = (event) => {
    const isChecked = event.target.checked;
    const movieid = event.target.value;
    const obj = {'id':movieid};
    this.setState({
        watchlist: [...this.state.watchlist, obj]
    });
    localStorage.setItem("watchlist", JSON.stringify(this.state.watchlist));   
  };

  handleOnSearch = (string, results) => {
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.
    // If useCached is true and results are are cached it
    // returns cached results    
  }
  handleOnSelect = (item) => {
    // the item selected    
    this.setState({movieid:item.id})
  }

  handleOnFocus = () => {
    console.log('Focused')
  }
  onChangeHandler(e){
    this.setState({
      input: e.target.value,
    })
  }
  render() {

    const LoaderSpinner =()=>(
        <div className="spinner-border spinner-grow-sm" role="status"></div>
    );
    let { loading, list, watchlist, unwatchlist, checkbox } = this.state;
    let listitem= Object.keys(list).length? list.results : [];
    console.log(list);
    const GetItemList=(itemid)=>{
         let item=listitem.find(x=>(x.id==itemid.itemid));
         return(
            <Card key={item.id}>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey={"moviebox_" + item.id}>
                    {item.original_title}
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey={"moviebox_" + item.id}>
                  <Card.Body>
                    <div className="d-flex align-items-center">
                        <div>
                            <i className="fas fa-image fa-5x"></i>
                        </div>
                        <div className="iron-man-list">
                            <p className="mb-0">Year: {item.release_date}</p>
                            <p className="mb-0">Runtime: 128</p>
                            <p className="mb-0">IMDB Score: {item.vote_average}</p>
                        </div>                        
                    </div>       
                    <div className="form-group form-check">
                        <input type="checkbox" className="form-check-input" id={"moviebox_" + item.id} value={item.id} onChange={this.addWatchlistCheck}/>
                        <label className="form-check-label" htmlFor={"moviebox_" + item.id}>Watched</label>
                    </div>                                        
                  </Card.Body>
                </Accordion.Collapse>
            </Card>
         )
    }
    // <input className="form-control mr-sm-2 w-auto" type="search" placeholder="Search MovieDB" aria-label="Search" />
    return (
          <div>
          <div className="row pb-5">
              <div className="col col-md-3">
                  <ReactSearchAutocomplete
                items={listitem}
                fuseOptions={{ keys: ["id", "original_title"] }}
                resultStringKeyName="original_title"
                onSearch={this.handleOnSearch}
                onSelect={this.handleOnSelect}
                onFocus={this.handleOnFocus}
                placeholder="Search MovieDB"
                autoFocus
              />
              </div>
              <div className="col col-md-3">
                  <button onClick={this.addWatchlist} type="button" className="btn btn-lg demo-btn">Add to Unwatched</button> 
              </div>
          </div>            
            <Tabs>                
                <div className="row">
                    <div className="col col-md-8 col-sm-12 col-xs-12">
                        <TabList>
                            <Tab>
                                 <div className="text-center px-2">
                                    <a href="#">
                                        <span><i className="fas fa-eye-slash"></i></span>
                                        <p>Unwatched</p>
                                    </a>
                                </div>
                              </Tab>
                              <Tab>
                                  <div className="text-center px-2">
                                    <a href="#">
                                        <span><i className="fas fa-eye"></i></span>
                                        <p>Watched</p>
                                    </a>
                                </div>
                              </Tab>
                        </TabList>
                    </div>
                    <div className="col col-md-4 col-sm-12 col-xs-12">
                      <div class="form-outline">
                      <input value={this.state.input} onChange={this.onChangeHandler.bind(this)} placeholder="Search movies" type="search" id="form1" class="form-control input-search" />
                      
                      </div>  
                    </div>
                </div>               
                <TabPanel className="pt-2">
                    <Accordion defaultActiveKey="0">
                        {Object.keys(unwatchlist).length ? (
                            this.state && this.state.unwatchlist
                            
                            .map(item =>
                                <GetItemList itemid={item.id} />
                            )                                                
                        ) : (
                            <tr className="col-lg-6 col-md-12">
                                <td>Unwatched not available ...!</td>
                            </tr>
                        )}    
                    </Accordion>
                </TabPanel>
                <TabPanel className="pt-2">
                    <Accordion defaultActiveKey="0">
                        {Object.keys(watchlist).length ? (
                            this.state && this.state.watchlist.map(item =>
                                <GetItemList itemid={item.id} />
                            )                                                
                        ) : (
                            <tr className="col-lg-6 col-md-12">
                                <td>Watched not available ...!</td>
                            </tr>
                        )}    
                    </Accordion>
                </TabPanel>
              </Tabs>
        </div>
    );
  }
}

export default Movies;
