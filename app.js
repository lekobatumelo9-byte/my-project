// These are the example books, members, and loans shown when the app first opens.
const seed = {
    books: [
        { id: 1, title: 'Mosali a nkhola', author: 'B.M Khaketla', isbn: '—', category: 'Literature', quantity: 10, available: 8, color: '#304d45' },
        { id: 2, title: 'Mophe', author: 'Sebolai Matlosa', isbn: '—', category: 'Literature', quantity: 10, available: 10, color: '#c48f54' },
        { id: 3, title: 'Meqoqo ea phirimana', author: 'J.G Mocoancoeng', isbn: '—', category: 'Literature', quantity: 10, available: 8, color: '#7895a1' },
        { id: 4, title: 'Mohloli oa lithothokiso', author: 'Thabang Tsolo', isbn: '—', category: 'Poetry', quantity: 10, available: 9, color: '#bd7952' },
        { id: 5, title: 'Tholoana tsa sethepu', author: 'B.M Khaketla', isbn: '—', category: 'Literature', quantity: 10, available: 9, color: '#846b9e' },
        { id: 6, title: 'Pitseng', author: 'Tomas Mofolo', isbn: '—', category: 'Literature', quantity: 10, available: 8, color: '#b3616a' },
        { id: 7, title: 'Mopheme', author: '—', isbn: '—', category: 'Literature', quantity: 10, available: 7, color: '#506a8a' }
    ],
    members: [
        { id: 1, name: 'Pakalitha Mafa', memberId: 'MEM-2048', role: 'Student', joined: 'Sep 2026', color: '#e9d5c2' },
        { id: 2, name: 'Mosa Lenea', memberId: 'MEM-2049', role: 'Student', joined: 'Sep 2026', color: '#d5e3d6' },
        { id: 3, name: 'Mateele Phamotse', memberId: 'MEM-2050', role: 'Student', joined: 'Sep 2026', color: '#e7d9e8' },
        { id: 4, name: 'Karabo Khotle', memberId: 'MEM-2051', role: 'Student', joined: 'Sep 2026', color: '#d8e2ed' },
        { id: 5, name: 'Naleli Letsatsi', memberId: 'MEM-2052', role: 'Student', joined: 'Sep 2026', color: '#f0dfc7' },
        { id: 6, name: 'Tseliso Majalle', memberId: 'MEM-2053', role: 'Student', joined: 'Sep 2026', color: '#d9e7df' },
        { id: 7, name: 'Karabo Sekate', memberId: 'MEM-2054', role: 'Student', joined: 'Sep 2026', color: '#ead9cf' },
        { id: 8, name: 'Reatlehile Ntjeke', memberId: 'MEM-2055', role: 'Student', joined: 'Sep 2026', color: '#dce4ee' }
    ],
    transactions: [
        // Current loans give each member one book, except Naleli, who has two.
        { id: 101, book: 7, member: 1, borrowed: 'Sep 15, 2026', due: 'Oct 15, 2026', status: 'Borrowed' },
        { id: 102, book: 7, member: 2, borrowed: 'Sep 16, 2026', due: 'Oct 16, 2026', status: 'Borrowed' },
        { id: 103, book: 1, member: 4, borrowed: 'Sep 17, 2026', due: 'Oct 17, 2026', status: 'Borrowed' },
        { id: 104, book: 6, member: 5, borrowed: 'Sep 18, 2026', due: 'Oct 18, 2026', status: 'Borrowed' },
        { id: 105, book: 7, member: 5, borrowed: 'Sep 18, 2026', due: 'Oct 18, 2026', status: 'Borrowed' },
        { id: 106, book: 4, member: 6, borrowed: 'Sep 19, 2026', due: 'Oct 19, 2026', status: 'Borrowed' },
        { id: 107, book: 3, member: 7, borrowed: 'Sep 20, 2026', due: 'Oct 20, 2026', status: 'Borrowed' },
        { id: 108, book: 1, member: 8, borrowed: 'Sep 21, 2026', due: 'Oct 21, 2026', status: 'Borrowed' },

        // The six recent activity items requested for the dashboard.
        { id: 201, book: 7, member: 1, memberName: 'Pakalitha Mafa', borrowed: 'Sep 23, 2026', due: 'Sep 23, 2026', status: 'Returned' },
        { id: 202, book: 5, member: 3, memberName: 'Mateele Phamotse', borrowed: 'Sep 24, 2026', due: 'Oct 08, 2026', status: 'Borrowed' },
        { id: 203, book: 6, member: null, memberName: 'Tsepo Nong', borrowed: 'Sep 25, 2026', due: 'Oct 09, 2026', status: 'Borrowed' },
        { id: 204, book: 3, member: null, memberName: 'Kabelo Tutu', borrowed: 'Oct 01, 2026', due: 'Oct 15, 2026', status: 'Borrowed' },
        { id: 205, book: 4, bookTitle: 'Mohloli wa lithothokiso', member: null, memberName: 'Bokang Makhanya', borrowed: 'Oct 04, 2026', due: 'Oct 04, 2026', status: 'Returned' },
        { id: 206, book: 7, member: 2, memberName: 'Mosa Lenea', borrowed: 'Oct 07, 2026', due: 'Oct 07, 2026', status: 'Returned' }
    ]
};
let data;
try{
    data=JSON.parse(localStorage.getItem('stacks-data-tumelo'))||seed
}
catch{
    data=seed
}
// Save data in this browser.
const persist = () => localStorage.setItem('stacks-data-tumelo',JSON.stringify(data));
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}
[c]));
const iconEdit='<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="m15 5 4 4M4 20l4-.8L19 8a2.8 2.8 0 0 0-4-4L4 15z"/></svg>',
iconTrash='<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M4 7h16M10 11v6m4-6v6M5 7l1 14h12l1-14M9 7V4h6v3"/></svg>';
function bookStatus(b){
    return b.available===0?'out':b.available<=2?'low':'available'
}
function pill(status,label){
    return `<span class="pill ${status}">${label}</span>`
}
function bookRow(b,editable=true){
    let s=bookStatus(b);
    return `<tr><td><div class="bookcell"><div class="cover" style="background:${b.color||'#607563'}">${esc(b.title.split(' ').slice(0,2).join('<br>'))}</div><div><div class="bookname">${esc(b.title)}</div><div class="bookauthor">${esc(b.author)}</div></div></div></td><td>${esc(b.isbn)}</td><td>${esc(b.category)}</td><td>${b.quantity}</td><td>${b.available}</td><td>${pill(s,s==='out'?'Out of stock':s==='low'?'Low stock':'Available')}</td>${editable?`<td><div class="rowactions"><button class="tinybtn" title="Edit" data-edit-book="${b.id}">${
        iconEdit
    }
    </button><button class="tinybtn" title="Delete" data-delete-book="${b.id}">${
        iconTrash
    }
    </button></div></td>`:''}</tr>`
}
function render() {
    const active=data.transactions.filter(t=>t.status==='Borrowed').length,
    low=data.books.filter(b=>b.available>0&&b.available<=2).length,
    available=data.books.reduce((a,b)=>a+b.available,0),
    copies=data.books.reduce((a,b)=>a+b.quantity,0);
    $('#mBooks').textContent=copies;
    $('#mBorrowed').textContent=active;
    $('#mMembers').textContent=data.members.length;
    $('#mAvailable').textContent=available;
    $('#overdueFoot').textContent=Math.max(0,Math.min(active,1));
    $('#lowFoot').textContent=low;
    $('#bookCount').textContent=data.books.length;
    $('#loanCount').textContent=active;
    $('#recentBooks').innerHTML=data.books.slice(0, 6).map(b=>bookRow(b,false)).join('')||'<tr><td colspan="5" class="empty">No books in your collection yet.</td></tr>';
    const q=($('#bookSearch')?.value||'').toLowerCase(),
    filter=$('#bookFilter')?.value||'all',
    books=data.books.filter(b=>(`${b.title} ${b.author} ${b.isbn} ${b.category}`).toLowerCase().includes(q)&&(filter==='all'||bookStatus(b)===filter));
    $('#allBooks').innerHTML=books.map(b=>bookRow(b)).join('')||'<tr><td colspan="7" class="empty">No books match your search.</td></tr>';
    $('#bookTotal').textContent=`(${data.books.length})`;
    $('#bookShowing').textContent=`Showing ${books.length} of ${data.books.length} books`;
    const mq=($('#memberSearch')?.value||'').toLowerCase(),
    members=data.members.filter(m=>`${m.name} ${m.memberId} ${m.role}`.toLowerCase().includes(mq));
    $('#allMembers').innerHTML=members.map(m=>`<tr><td><div class="bookcell"><div class="avatar" style="background:${m.color}">${m.name.split(' ').map(x=>x[0]).join('').slice(0,2)}</div><div><div class="bookname">${esc(m.name)}</div><div class="bookauthor">Library member</div></div></div></td><td>${esc(m.memberId)}</td><td>${esc(m.role)}</td><td>${data.transactions.filter(t=>t.member===m.id&&t.status==='Borrowed').length}</td><td>${esc(m.joined)}</td><td><div class="rowactions"><button class="tinybtn" title="Edit" data-edit-member="${m.id}">${iconEdit}</button><button class="tinybtn" title="Delete" data-delete-member="${m.id}">${iconTrash}</button></div></td></tr>`).join('')||'<tr><td colspan="6" class="empty">No members match your search.</td></tr>';
    $('#memberTotal').textContent=`(${data.members.length})`;
    $('#memberShowing').textContent=`Showing ${members.length} of ${data.members.length} members`;
    const tq=($('#transSearch')?.value||'').toLowerCase(),
    tf=$('#transFilter')?.value||'all',
    transactions=[...data.transactions].reverse().filter(t=>{
        let b=data.books.find(x=>x.id===t.book),m=data.members.find(x=>x.id===t.member);
        return `${b?.title} ${m?.name||t.memberName} ${t.status}`.toLowerCase().includes(tq)&&(tf==='all'||t.status===tf)
    }
    );
    $('#allTransactions').innerHTML=transactions.map(t=>{
        let b=data.books.find(x=>x.id===t.book)||{
            title:'Deleted book',color:'#777'
        },
m=data.members.find(x=>x.id===t.member)||{
            name:t.memberName||'Deleted member'
        }
        ;
        return `<tr><td><div class="bookcell"><div class="cover" style="background:${b.color}">BOOK</div><div><div class="bookname">${esc(b.title)}</div></div></div></td><td>${esc(m.name)}</td><td>${esc(t.borrowed)}</td><td>${esc(t.due)}</td><td>${pill(t.status==='Borrowed'?'low':'available',t.status)}</td><td>${t.status==='Borrowed'?`<button class="btn" style="padding:7px 10px;font-size:10px" data-return="${t.id}">Mark returned</button>`:'<span style="color:#a1a59d">—</span>'}</td></tr>`
    }
    ).join('')||'<tr><td colspan="6" class="empty">No transactions match your search.</td></tr>';
    $('#transTotal').textContent=`(${data.transactions.length})`;
    $('#transShowing').textContent=`Showing ${transactions.length} of ${data.transactions.length} transactions`;
    $('#activity').innerHTML = [...data.transactions].slice(-6).reverse().map(transaction => {
        const book = data.books.find(item => item.id === transaction.book) || { title: 'a book' };
        const shownBook = transaction.bookTitle || book.title;
        const member = data.members.find(item => item.id === transaction.member);
        const memberName = member ? member.name : transaction.memberName || 'A member';
        const returned = transaction.status === 'Returned';
        const arrow = returned ? 'M19 7l-7 7-4-4' : 'M4 7h15l-3-3M20 17H5l3 3';

        return `<div class="activityrow">
            <div class="activityicon ${returned ? 'return' : ''}">
                <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="${arrow}"/></svg>
            </div>
            <div class="activitytext"><b>${esc(memberName)}</b> ${returned ? 'returned' : 'borrowed'} <b>${esc(shownBook)}</b></div>
            <div class="activitytime">${esc(transaction.borrowed)}</div>
        </div>`;
    }).join('') || '<div class="empty">No activity yet.</div>';
    persist()
}
function toast(msg){
    const t=$('#toast');
    t.textContent=msg;
    t.classList.add('show');
    setTimeout(()=>t.classList.remove('show'),2600)
}
const fields=$('#fields');
let editing=null,
formType='book';
function showModal(type,record=null){
    editing=record;
    formType=type;
    $('#modalTitle').textContent=(record?'Edit ':'Add a ')+(type==='book'?'book':type==='member'?'member':'transaction');
    $('#saveBtn').textContent=record?'Save changes':type==='transaction'?'Create transaction':'Add '+type;
    const b=record||{
    },

    input=(label,key,val='',opts=null,full=false)=>`<div class="field ${full?'full':''}"><label>${label}</label>${opts?`<select name="${key}" required>${
        opts.map(o=>`<option ${o===val?'selected':''}>${esc(o)}</option>`).join('')
    }
    </select>`:`<input name="${key}" value="${esc(val)}" ${
        key==='quantity'?'type="number" min="0"':key==='available'?'type="number" min="0"':''
    }
     required>`}</div>`;
    if(type==='book')fields.innerHTML=input('Book title','title',b.title,'',true)+input('Author','author',b.author)+input('ISBN','isbn',b.isbn)+input('Category','category',b.category,['Fiction','Non-fiction','Memoir','Science fiction','Self-help','History','Design','Art & design','Other'])+input('Total quantity','quantity',b.quantity??1)+input('Available copies','available',b.available??1);
    else if(type==='member')fields.innerHTML=input('Full name','name',b.name,'',true)+input('Member ID','memberId',b.memberId||`MEM-${2054+data.members.length}`)+input('Membership type','role',b.role||'Student',['Student','Faculty','Community'])+input('Joined','joined',b.joined||new Date().toLocaleDateString('en-US',{
        month:'short',day:'2-digit',year:'numeric'
    }
    ));
    else fields.innerHTML=`<div class="field full"><label>Book</label><select name="book" required>${data.books.filter(x=>x.available>0).map(x=>`<option value="${x.id}">${
        esc(x.title)
    }
     — ${
        x.available
    }
     available</option>`).join('')}</select></div><div class="field full"><label>Member</label><select name="member" required>${data.members.map(x=>`<option value="${x.id}">${
        esc(x.name)
    }
     (${
        esc(x.memberId)
    }
    )</option>`).join('')}</select></div><div class="field"><label>Borrowed on</label><input name="borrowed" value="${new Date().toLocaleDateString('en-US',{month:'short',day:'2-digit',year:'numeric'})}" required></div><div class="field"><label>Due date</label><input name="due" value="${new Date(Date.now()+14*86400000).toLocaleDateString('en-US',{month:'short',day:'2-digit',year:'numeric'})}" required></div>`;
    $('#overlay').classList.add('open')
}
function closeModal(){
    $('#overlay').classList.remove('open')
}
$('#closeModal').onclick=closeModal;
$('#cancelModal').onclick=closeModal;
$('#overlay').addEventListener('click',e=>{
    if(e.target===$('#overlay'))closeModal()
}
);
$('#form').addEventListener('submit',e=>{
    e.preventDefault();
    let f=Object.fromEntries(new FormData(e.target));
    if(formType==='book'){
        f.quantity=+f.quantity;
        f.available=+f.available;
        if(f.available>f.quantity){
            toast('Available copies can’t exceed total quantity.');
            return
        }
        if(editing)Object.assign(data.books.find(x=>x.id===editing.id),f);
        else data.books.push({
            id:Date.now(),color:['#607563','#bd7952','#846b9e','#506a8a'][data.books.length%4],...f
        }
        );
        toast(editing?'Book updated':'Book added to collection')
    }
    else if(formType==='member'){
        if(editing)Object.assign(data.members.find(x=>x.id===editing.id),f);
        else data.members.push({
            id:Date.now(),color:'#d9e7df',...f
        }
        );
        toast(editing?'Member updated':'Member added')
    }
    else{
        const book=data.books.find(x=>x.id===+f.book);
        if(!book){
            toast('No copies available.');
            return
        }
        book.available--;
        data.transactions.push({
            id:Date.now(),book:book.id,member:+f.member,borrowed:f.borrowed,due:f.due,status:'Borrowed'
        }
        );
        toast('Transaction created')
    }
    ;
    closeModal();
    render()
}
);
// Handle buttons for editing, deleting, returning, and navigation.
document.addEventListener('click',e=>{
    const t=e.target.closest('[data-edit-book],[data-delete-book],[data-edit-member],[data-delete-member],[data-return],[data-goto]');
    if(!t)return;
    if(t.dataset.editBook){
        showModal('book',data.books.find(x=>x.id==t.dataset.editBook))
    }
    if(t.dataset.deleteBook){
        let id=+t.dataset.deleteBook;
        data.books=data.books.filter(x=>x.id!==id);
        render();
        toast('Book removed')
    }
    if(t.dataset.editMember){
        showModal('member',data.members.find(x=>x.id==t.dataset.editMember))
    }
    if(t.dataset.deleteMember){
        let id=+t.dataset.deleteMember;
        data.members=data.members.filter(x=>x.id!==id);
        render();
        toast('Member removed')
    }
    if(t.dataset.return){
        let tr=data.transactions.find(x=>x.id==t.dataset.return);
        tr.status='Returned';
        let b=data.books.find(x=>x.id===tr.book);
        if(b)b.available=Math.min(b.quantity,b.available+1);
        render();
        toast('Book marked as returned')
    }
    if(t.dataset.goto)go(t.dataset.goto)
}
);
function go(view) {
    document.querySelectorAll('.view').forEach(x=>x.classList.toggle('active',x.id==='view-'+view));
    document.querySelectorAll('#nav button').forEach(x=>x.classList.toggle('active',x.dataset.view===view));
    const labels={
        dashboard:'Overview',
        books:'Book collection',
        members:'Members',
        transactions:'Transactions'
    }
    ;
    $('#crumb').textContent=labels[view];
    window.scrollTo({
        top:0,behavior:'smooth'
    }
    )
}
$('#nav').addEventListener('click',e=>{
    let b=e.target.closest('[data-view]');
    if(b)go(b.dataset.view)
}
);
document.querySelectorAll('[data-goto]').forEach(x=>{
}
);
$('#addBook').onclick=$('#quickAdd').onclick=()=>showModal('book');
$('#addMember').onclick=()=>showModal('member');
$('#addTransaction').onclick=$('#quickLoan').onclick=()=>showModal('transaction');
$('#bookSearch').addEventListener('input',render);
$('#bookFilter').addEventListener('change',render);
$('#memberSearch').addEventListener('input',render);
$('#transSearch').addEventListener('input',render);
$('#transFilter').addEventListener('change',render);
$('#settingsBtn').onclick=()=>toast('Library settings are up to date.');
$('#notif').onclick=()=>toast('You’re all caught up.');
$('#today').textContent=new Date().toLocaleDateString('en-US',{
    weekday:'short',month:'short',day:'numeric',year:'numeric'
}
);
render();
