import React, {Component} from 'react';
import './App.css';
import ControlPanel from "./control-panel/ControlPanel";
import FileZone from "./file-zone/FileZone";
import getMockText from './text.service';
import GeneratorId from './common/generator-id/GeneratorId';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allWords: []
        }
    }

    componentDidMount() {
        this.loadInitialText();
    }

    loadInitialText = () => {
        getMockText().then(result => {
            this.setState({
                allWords: [`<p id='${GeneratorId.generateId()}'>${result}</p>`]
            });
        });
    }

    onUpdateAllWords = (newWords) => {
        this.setState({
            allWords: newWords
        });
    }

    render() {
        return (
            <div className="App">
                <header>
                    <span>Simple Text Editor</span>
                </header>
                <main>
                    <ControlPanel
                        allWords={this.state.allWords}
                        handleUpdateWords={this.onUpdateAllWords}
                    />
                    <FileZone
                        allWords={this.state.allWords}
                        handleUpdateWords={this.onUpdateAllWords}
                    />
                </main>
            </div>
        );
    }
}

export default App;
