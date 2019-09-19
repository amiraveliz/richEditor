import React, { Component } from 'react';

import GeneratorId from '../common/generator-id/GeneratorId';

import './ControlPanel.css';

class ControlPanel extends Component {
    constructor(props) {
        super(props);
    }

    onBoldClick = () => {
        this.updateWithSelection('b');
    }

    onItalicClick = () => {
        this.updateWithSelection('i');
    }

    onUnderlineClick = () => {
        this.updateWithSelection('u');
    }

    updateWithSelection = (tagName) => {
        const mySelection = window.getSelection();
        const { anchorOffset, extentOffset, anchorNode } =  mySelection;
        if (anchorOffset !== extentOffset) {
            const selectedString = anchorNode.data;
            let selectedWord = selectedString.substring(anchorOffset, extentOffset);
            const selectedId = this.getElementId();

            if (anchorNode.parentNode.id !== 'file') {
                selectedWord = anchorNode.parentNode;
                while (selectedWord.parentNode.id !== 'file') {
                    selectedWord = selectedWord.parentNode;
                }
            }

            this.updateToText(
                anchorOffset,
                extentOffset,
                selectedString,
                selectedWord,
                selectedId,
                tagName
            );
        }
    }

    updateToText = (anchorOffset, extentOffset, selectedString, selectedWord, selectedId, tagName) => {
        //updated string
        let newString;

        //removes styles
        if (this.hasStyle(selectedWord, tagName)) {
            const updatedWord = this.removeStyle(selectedWord, tagName);
            newString = updatedWord;
        //add styles
        } else {
            const newWord = selectedWord.nodeName? selectedWord.outerHTML: selectedWord;
            newString =
                `<p id='${selectedId}'>${selectedString.substring(0, anchorOffset)}</p>` +
                `<${tagName} id='${GeneratorId.generateId()}'>${newWord}</${tagName}>` +
                `<p id='${GeneratorId.generateId()}'>${selectedString.substring(extentOffset)}</p>`;
        }

        let allNewWords = [];
        this.props.allWords.forEach(word => {
            if (word.id === selectedId) {
                allNewWords = [...allNewWords, newString];
            } else {
                allNewWords.push(word);
            }
        });

        this.props.handleUpdateWords(allNewWords);
    }

    hasStyle = (selectedWord, tagName) => {
        return selectedWord.outerHTML && selectedWord.outerHTML.includes(`</${tagName}>`);
    }

    removeStyle = (selectedWord, tagName) => {
        let re = new RegExp(`\\b${tagName}\\b`, 'gi');
        selectedWord = selectedWord.outerHTML.replace(re, 'p');
        return selectedWord;
    }

    getValidNode  = (node) => {
        //if it is a node text
        if (node.parentElement.id === 'file') {
            return node;
        } else {
            node = node.parentNode;
            while (node.parentElement.id !== 'file') {
                node = node.parentNode;
            }
            const tagName = node.tagName.toLowerCase();
            //bold, italic, underline
            if (tagName === 'b' || tagName === 'i' || tagName === 'u') {
                return node;
            } else {
                //no valid node
                return null;
            }
        }
    }

    getElementId = () => {
        let element;
        if (window.getSelection) {
            const selObj = window.getSelection();
            if (selObj.rangeCount > 0) {
                const selRange = selObj.getRangeAt(0);
                element = this.getValidNode(selRange.commonAncestorContainer);
            }
        } else if (document.selection && document.selection.type !== 'Control') {
            element = this.getValidNode(document.selection.createRange().parentElement());
        }
        return element ? element.id : null;
    }

    render() {
        return (
            <div id="control-panel">
                <div id="format-actions">
                    <button className="format-action" type="button" onClick={this.onBoldClick}>
                        <b>B</b>
                    </button>
                    <button className="format-action" type="button" onClick={this.onItalicClick}>
                        <i>I</i>
                    </button>
                    <button className="format-action" type="button" onClick={this.onUnderlineClick}>
                        <u>U</u>
                    </button>
                </div>
            </div>
        );
    }
}

export default ControlPanel;
