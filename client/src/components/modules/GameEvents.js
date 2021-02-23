import React, { Component } from "react";

/**
 * Card is a component for displaying content like stories
 *
 * Proptypes
 * @param {Array} events
 */
class GameEvents extends Component {
    constructor(props) {
      super(props);
    }
  
    render() {
      let eventsList = null;
      if (this.props.events.length > 0) {
        eventsList = this.props.events.map((event) => (
          <div key={event}>
            {event}
          </div>
        ));
      } else {
        eventsList = <div>No events!</div>;
      }
      return (
        <div key="1">
            {eventsList}
        </div>
      );
    }
  }
  
  export default GameEvents;