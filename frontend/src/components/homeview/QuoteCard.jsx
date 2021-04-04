import React, { Component } from 'react';
class QuoteCard extends Component {
  state = {  }
  render() { 
    return ( 
    <div className="row mt-5 mb-5" id="the_quote">
      <div className="col-lg-6 mx-auto">
        <blockquote className="blockquote blockquote-custom bg-white p-5 shadow rounded">
          <div className="blockquote-custom-icon bg-info shadow-sm"><i className="fa fa-quote-left text-white"></i></div>
          <p className="mb-0 mt-2 font-italic">"You only need 1000 hours of hard practice to master anything in the
            world."</p>
          <footer className="blockquote-footer pt-4 mt-4 border-top">Gladwell's
            <cite title="Source Title">1000 hours rule</cite>
          </footer>
        </blockquote>
      </div>
    </div>);
  }
}
 
export default QuoteCard;