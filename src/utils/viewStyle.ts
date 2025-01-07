export const viewStyle = `& {
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
    }

    .nested {
      list-style-type: none;
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
  }`;
