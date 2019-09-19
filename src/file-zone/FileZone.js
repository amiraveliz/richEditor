import React, { Component } from 'react';
import sanitizeHtml from 'sanitize-html';
import GeneratorId from '../common/generator-id/GeneratorId';
import './FileZone.css';

class FileZone extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    onBlurText = (e) => {
        const allNodes = e.target.childNodes;
        const allNodesWithId = [];
        allNodes.forEach(node => {
            node.id = GeneratorId.generateId();
            allNodesWithId.push(node);
        });

        this.props.handleUpdateWords(allNodesWithId);
    }

    render() {
        const { allWords } = this.props;

        let newAllWords = '';
        allWords.forEach(node => {
            newAllWords += node.outerHTML || node.data || node;
        });

        const clean = sanitizeHtml(newAllWords, {
            allowedTags: ['b', 'i', 'u']
        });

        return (
            <div id="file-zone">
                <div
                    id="file"
                    contentEditable="true"
                    dangerouslySetInnerHTML={{__html: clean}}
                    onBlur={this.onBlurText}
                >
                </div>
            </div>
        );
    }
}

export default FileZone;
