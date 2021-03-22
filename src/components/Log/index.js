import React from 'react';
import PropTypes from 'prop-types';
import Order from '../Order';
import { OrderSide } from 'opensea-js/lib/types';
import { connectWallet, SEACREATURES_FACTORY_ADDRESS, SEACREATURES_INDIVIDUAL_ADDRESS } from '../../constants';

export default class Log extends React.Component {
  static propTypes = {
    seaport: PropTypes.object.isRequired,
    accountAddress: PropTypes.string
  };

  state = {
    orders: undefined,
    total: 0,
    factoryCollection: true,
    showWallet: false,
    page: 1
  };

  componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    const { factoryCollection } = this.state

    const { orders, count } = await this.props.seaport.api.getOrders({
      asset_contract_address: factoryCollection ? SEACREATURES_FACTORY_ADDRESS : SEACREATURES_INDIVIDUAL_ADDRESS,
    }, this.state.page)
    //console.log(orders);
    this.setState({ orders, total: count })

    /// Get assets from a collection
    // const { assets } = await this.props.seaport.api.getAssets({
    //   collection: "opensea-creatures-bv62zugfvt"

    // })
    // console.log(assets);
  }

  paginateTo(page) {
    this.setState({ orders: undefined, page }, () => this.fetchData())
  }

  async toggleCollection(factoryCollection) {
    this.setState({
      factoryCollection: factoryCollection, showWallet: false
    }, () => this.fetchData())
  }

  async toggleWallet() {
    const { accountAddress } = this.props
    const { assets } = await this.props.seaport.api.getAssets({
      //asset_contract_address: "0xeb391f33b7da0abb89a68adcb92ae10ee7b24e78",
      owner: accountAddress,
    }, this.state.page)
    console.log(assets);
    this.setState({
      showWallet: true
    })
  }

  renderPagination() {
    const { page, total } = this.state
    const ordersPerPage = this.props.seaport.api.pageSize
    const noMorePages = page*ordersPerPage >= total
    return (
      <nav>
        <ul className="pagination justify-content-center">
          <li className={"page-item " + (page === 1 ? "disabled" : "")}>
            <a className="page-link" href="#Log"
              onClick={() => this.paginateTo(page - 1)} tabIndex="-1">
              Previous
            </a>
          </li>
          <li className={"page-item " + (noMorePages ? "disabled" : "")}>
            <a className="page-link" href="#Log"
              onClick={() => this.paginateTo(page + 1)}>
              Next
            </a>
          </li>
        </ul>
      </nav>
    )
  }

  renderFilters() {
    const { factoryCollection, showWallet } = this.props

    return (
      <div className="row">
        <div className="mb-3 ml-4">
          <div className="btn-group ml-4" role="group">
            <button type="button" className={"btn btn-outline-primary " + (factoryCollection ? "active" : "")} data-toggle="button" onClick={() => this.toggleCollection(true)}>
              Store 1
            </button>
            <button type="button" className={"btn btn-outline-success " + (factoryCollection ? "active" : "")} data-toggle="button" onClick={() => this.toggleCollection(false)}>
              Store 2
            </button>
          </div>
        </div>
        <div className="mb-3 ml-4">
          <button type="button" className={"btn btn-outline-info " + (showWallet ? "active" : "")} data-toggle="button" onClick={() => this.toggleWallet()}>
            Wallet
          </button>
        </div>
      </div>
    )
  }

  render() {
    const { orders } = this.state

    return (
      <div className="container py-3" id="Log">

        {this.renderFilters()}

        {orders != null
        
          ? <React.Fragment>
              <div className="card-deck">
                {orders.map((order, i) => {
                  return <Order {...this.props} key={i} order={order}  />
                })}
              </div>
              {this.renderPagination()}
            </React.Fragment>

          : <div className="text-center">Loading...</div>
        }
      </div>
    );
  }
}
