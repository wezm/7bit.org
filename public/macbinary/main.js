import init, { parse_macbinary } from './macbinary.js';

async function run() {
    await init();
}

async function readMacbinary(event, details, error) {
    event.preventDefault();
    details.classList.add('hidden');
    error.classList.add('hidden');

    try {
        const file = document.forms[0]['file'].files.item(0);
        const data = await file.arrayBuffer();
        const res = parse_macbinary(data);

        setField('filename', res.name);
        setField('type', res.type);
        setField('creator', res.creator);
        setField('data_fork_len', res.data_fork.length);
        setField('rsrc_fork_len', res.rsrc_fork_len);
        const downloadDataLink = document.getElementById('download_data_fork');
        downloadDataLink.href = URL.createObjectURL(new Blob(
            [ res.data_fork ],
            { type: 'application/octet-stream' }
        ));
        downloadDataLink.download = res.name;
        setField('created', new Date(res.created * 1000).toString());
        setField('modified', new Date(res.modified * 1000).toString());

        const template = document.getElementById('resource');
        const resourceTable = document.querySelector('#resources table');
        const tbody = resourceTable.querySelector('tbody');
        tbody.replaceChildren(); // remove all children
        for (const rsrc of res.resources) {
            const tr = template.content.cloneNode(true);
            const rows = tr.querySelectorAll('td');
            rows[0].querySelector('code').textContent = rsrc.type;
            rows[1].textContent = rsrc.id;
            rows[2].textContent = rsrc.data.length;
            rows[3].textContent = rsrc.name || "";
            const a = rows[4].querySelector('a');
            a.href = URL.createObjectURL(new Blob(
                [ rsrc.data ],
                { type: 'application/octet-stream' }
            ));
            a.download = `${res.name}.${rsrc.type}`;
            tbody.append(tr);
        }

        details.classList.remove('hidden');
    }
    catch(e) {
        error.classList.remove('hidden');
        if (typeof e === "string") {
            error.querySelector('p').textContent = e;
        }
        else {
            error.querySelector('p').textContent = e.message;
        }
    }
}

function setField(name, value) {
    document.getElementById(name).textContent = value;
}

document.addEventListener("DOMContentLoaded", async (event) => {
    const details = document.getElementById('details');
    const error = document.getElementById('error');

    document.forms[0].addEventListener('submit', async (e) => readMacbinary(e, details, error));

    run()
        .then(() => document.forms[0]['read'].disabled = false)
        .catch(() => {
            error.classList.remove('hidden');
            error.querySelector('p').textContent = "Unable to initialise WASM module.";
        });
});
