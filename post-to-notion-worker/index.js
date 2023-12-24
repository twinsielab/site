addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  try {
    const params = new URL(request.url).searchParams;
    const token = params.get('token');
    const databaseId = params.get('db');
    const title = params.get('title');
    let properties = {
      'Name': {
        'title': [{ 'text': { 'content': title } }]
      }
    };

    const markdown = params.get('content');
    let content = markdown ? parseMarkdown(markdown) : [];

    // Add additional properties with specified types
    params.forEach((value, key) => {
      if (key.startsWith('-')) {
        const [propName, propType] = key.substring(1).split(':');
        properties[propName] = formatProperty(propType, value);
      }
    });

    const result = await addItemToNotionDatabase(token, databaseId, properties, content);
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(`Error: ${error.toString()}`, { status: 500 });
  }
}

function formatProperty(type, value) {
  switch (type) {
    case 'text':
      return { 'rich_text': [{ 'text': { 'content': value } }] };
    case 'number':
      return { 'number': parseInt(value) };
    case 'date':
      return { 'date': { 'start': value } };
    case 'select':
      return { 'select': { 'name': value } };
    case 'url':
      return { 'url': value };
    case 'multi_select':
      return { 'multi_select': value.split(',').map(option => ({ 'name': option.trim() })) };
    default:
      return { 'rich_text': [{ 'text': { 'content': value } }] };
  }
}



function parseMarkdown(markdown) {
  const lines = markdown.split('\n');
  let blocks = [];

  for (let line of lines) {
    if (line.startsWith('# ')) {
      blocks.push(createHeadingBlock(line.slice(2), 1));
    } else if (line.startsWith('## ')) {
      blocks.push(createHeadingBlock(line.slice(3), 2));
    } else if (line.startsWith('### ')) {
      blocks.push(createHeadingBlock(line.slice(4), 3));
    } else if (line.startsWith('![')) {
      let match = line.match(/!\[.*\]\((.*)\)/);
      if (match) {
        blocks.push({ 'type': 'image', 'image': { 'type': 'external', 'external': { 'url': match[1] } } });
      }
    } else if (line.startsWith('[')) {
      let match = line.match(/\[(.*)\]\((.*)\)/);
      if (match) {
        blocks.push(createTextBlock(match[1], match[2]));
      }
    } else {
      blocks.push(createTextBlock(line));
    }
  }

  return blocks;
}

function createHeadingBlock(text, level) {
  return {
    'type': `heading_${level}`,
    [`heading_${level}`]: {
      'rich_text': [{ 'type': 'text', 'text': { 'content': text } }]
    }
  };
}

function createTextBlock(text, link = null) {
  let textContent = { 'type': 'text', 'text': { 'content': text } };
  if (link) {
    textContent.text.link = { 'url': link };
  }
  return { 'type': 'paragraph', 'paragraph': { 'rich_text': [textContent] } };
}


async function addItemToNotionDatabase(token, databaseId, properties, content) {
  const url = `https://api.notion.com/v1/pages`;
  const data = {
    parent: { database_id: databaseId },
    properties: properties,
    children: content // Adding the content blocks to the page
  };

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Notion-Version': '2022-02-22'
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });

    const body = await response.text();

    if (!response.ok) {
      console.error('Response not ok!', body);
      throw new Error(`Notion API responded with status: ${response.status}.\n\n${body} \n\nData sent:${JSON.stringify(data,null,4)}`);
    }

    return body;
  } catch (error) {
    console.error('Request error!', error);
    throw new Error(`Error adding item to Notion: ${error.message}`);
  }
}
