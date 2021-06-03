import React, { Component } from "react";
import "./Landing.css";

class Rules extends Component {
    constructor(props) {
      super(props);
      // Initialize Default State
      this.state = {};
    }
  
    componentDidMount() {
      // remember -- api calls go here!

    }

    render() {
        return (
          <>
            <h1>How does this game work?</h1>
            <h2>The rules are a little different from regular Monopoly</h2>
          

            <h2>Just like regular monopoly except:</h2>
            <ul>
              <li>Board spaces are locations at MIT!</li>
              <li>Tim's Tour locations move you to a random location on the map.</li>
              <li>If you land on Treasure Chest, you gain or loose some money (up to $300!)</li>
              <li>Players are in student groups. 
                These groups want to expand their influence by 
                fundraising and recruiting new members.</li>
                <li>Players buy booths to advertise their student groups. (instead of hotels)</li>
                <li>When you land on a location with a booth that you don't own, 
               you have to donate to their cause so that they'll stop pestering you. (like paying rent) </li>
               <li>You cannot trade properties with other players.</li>
               <li>MIT is like the Bank. At the beginning, they own all the locations.</li>

              <li>When players log out, they become 'ghost players'. Ghost players continue to move around the board and pay rent, 
                  but they can't buy properties.
              </li>
              <li>When Ghost players log back in, they become active players again.</li>
              <li>When you run out of money, your game is over. All of your properties revert back
                  to MIT. Log out and log back in to start over, as a new player.
              </li>
              <li>You can only start over, as a new player, after you run out of money</li>
            </ul>
            
          </>
        );
      }
    }
    
    export default Rules;
