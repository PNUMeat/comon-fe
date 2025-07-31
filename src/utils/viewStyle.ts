import { breakpoints } from '@/constants/breakpoints.ts';

export const viewStyle = `& {
    img {
        max-width: 600px;
        object-fit: contain;
    }
    
    span {
      white-space: pre-wrap !important;
      dir: ltr !important;
      word-break: break-word;
    }
    
    span.editor-image {
      display: inline-block;
    }
    
    sup, .editor-text-superscript {
      vertical-align: super;
      font-size: 0.8rem;
    }
    
    sub, .editor-text-subscript {
      vertical-align: sub;
      font-size: 0.8rem;
    }
    
    .editor-text-bold {
      font-weight: bold;
    }
    
    .editor-text-italic {
      font-style: italic;
    }
    
    .editor-text-strikethrough {
      text-decoration: line-through
    }
    
    h1 {
      font-size: 32px;
      font-weight: 600;
      line-height: 1.2;
    }

    h2 {
      font-size: 28px;
      font-weight: 500;
      line-height: 1.3;
    }

    h3 {
      font-size: 24px;
      font-weight: 500;
      line-height: 1.4;
    }

    h4 {
      font-size: 20px;
      font-weight: 500;
      line-height: 1.5;
    }

    h5 {
      font-size: 16px;
      font-weight: 500;
      line-height: 1.6;
      color: rgba(55, 53, 47, 0.8);
    }

    h6 {
      font-size: 14px;
      font-weight: 500;
      line-height: 1.6;
      color: rgba(55, 53, 47, 0.6);
    }

    p + h1,
    p + h2,
    p + h3,
    p + h4,
    p + h5,
    p + h6 {
      margin-top: 32px;
    }

    .editor-text-italic {
      font-style: italic;
    }

    .editor-text-underline {
      text-decoration: underline;
    }

    .editor-text-strikethrough {
      text-decoration: line-through;
    }

    .editor-quote {
      margin: 0;
      margin-left: 20px;
      font-size: 15px;
      color: rgb(101, 103, 107);
      border-left-color: rgb(206, 208, 212);
      border-left-width: 4px;
      border-left-style: solid;
      padding-left: 16px;
    }

    ul,
    ol {
      padding: 0;
      margin: 0;
      margin-left: 16px;
    }

    .editor-listitem {
      margin: 8px 32px 8px 32px;

      @media (max-width: ${breakpoints.mobile}px) {
        margin: 0;
      }
    }

    .nested {
      list-style-type: none;
    }
    
    
.code-action-menu-container {
    height: 36px;
    font-size: 10px;
    color: rgba(0, 0, 0, 0.5);
    position: absolute;
    display: flex;
    align-items: center;
    flex-direction: row;
    user-select: none;
}

.code-action-menu-container .code-highlight-language {
    margin-right: 4px;
}

.code-action-menu-container button.menu-item {
    border: 1px solid transparent;
    border-radius: 4px;
    padding: 4px;
    background: none;
    cursor: pointer;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    color: rgba(0, 0, 0, 0.5);
    text-transform: uppercase;
}

.code-action-menu-container button.menu-item:hover {
    border: 1px solid rgba(0, 0, 0, 0.3);
    opacity: 0.9;
}

.code-action-menu-container button.menu-item:active {
    background-color: rgba(223, 232, 250);
    border: 1px solid rgba(0, 0, 0, 0.45);
}
  }

  & ul {
    list-style-type: disc;
  }

  & ul ul {
    list-style-type: circle;
  }

  & ul ul ul {
    list-style-type: square;
  }

  & ul ul ul ul {
    list-style-type: disc;
  }

  & ul ul ul ul ul {
    list-style-type: circle;
  }

  & ul ul ul ul ul ul {
    list-style-type: square;
  }

  & ol {
    list-style-type: decimal;
  }

  & ol ol {
    list-style-type: lower-alpha;
  }

  & ol ol ol {
    list-style-type: lower-roman;
  }

  & ol ol ol ol {
    list-style-type: decimal;
  }

  & ol ol ol ol ol {
    list-style-type: lower-alpha;
  }

  & ol ol ol ol ol ol {
    list-style-type: lower-roman;
  }
  
.codeblock {
    background-color: #f8f6f2;
    font-family: Menlo, Consolas, Monaco, monospace;
    display: block;
    padding: 8px 8px 8px 52px;
    line-height: 1.53;
    font-size: 16px;
    margin: 8px 0;
    max-width: 576px;
    overflow-x: auto;
    overflow-y: hidden;
    position: relative;
    tab-size: 2;
    white-space: pre;
    
    @media (max-width: ${breakpoints.mobile}px) {
      font-size: 12px;
  }
}
.codeblock span {
    white-space: preserve nowrap !important;
}

.codeblock:before {
    content: attr(data-gutter);
    position: absolute;
    background-color: #eee;
    left: 0;
    top: 0;
    border-right: 1px solid #ccc;
    padding: 8px;
    color: #777;
    white-space: pre-wrap;
    text-align: right;
    min-width: 25px;
}

.tokenComment, .r {
    color: slategray;
}
.tokenPunctuation, .v {
    color: #999;
}
.tokenProperty, .p {
    color: #905;
}
.tokenSelector, .q {
    color: #690;
}
.tokenOperator, .t {
    color: #9a6e3a;
}
.tokenAttr, .o {
    color: #07a;
}
.tokenVariable, .u {
    color: #e90;
}
.tokenFunction, .s {
    color: #dd4a68;
}

  
  `;
