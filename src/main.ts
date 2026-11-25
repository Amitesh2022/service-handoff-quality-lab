import {LitElement,html,nothing,unsafeCSS} from 'lit'
import {repeat} from 'lit/directives/repeat.js'
import styles from './style.css?inline'
import './style.css'
import {Desk,select,categories,stages,value,formatDate,type State} from './desk'
const count=(state:State)=>Object.fromEntries(stages.map(stage=>[stage,state.records.filter(r=>r.stage===stage).length]))
class HandoffDesk extends LitElement {
 static styles=unsafeCSS(styles)
 static properties={view:{state:true}}
 private desk=new Desk()
 private stop?:()=>void
 private unsubscribe?:()=>void
 declare private view:State
 constructor(){super();this.view=this.desk.state}
 connectedCallback(){super.connectedCallback();this.unsubscribe=this.desk.subscribe(s=>{this.view=s});this.stop=this.desk.start()}
 disconnectedCallback(){this.stop?.();this.unsubscribe?.();super.disconnectedCallback()}
 render(){
  const {desk,view:s}=this
  const visible=select(s.records,s.query,s.filter,s.sort)
  const totals=count(s)
  return html`
<header class="top"><div class="wrap bar"><a class="brand" href="#board"><span class="mark" aria-hidden="true">◇</span>Service Handoff Quality Lab</a><nav aria-label="Workspace"><a href="#board" aria-current=${s.page==='board' ? 'page' : null}>Work queue</a><a href="#guide" aria-current=${s.page==='guide' ? 'page' : null}>Playbook</a></nav></div></header>
<main class="wrap">
${s.page==='board'?html`
<section class="hero"><div><p class="eyebrow">SERVICE QUALITY / WORK QUEUE</p><h1>Service Handoff Quality Lab</h1><p class="lead">Review fictional assistant-to-agent handoffs and record improvements before release.</p></div><button type="button" @click=${(e:Event)=>{desk.edit()}}>New handoff review</button></section>
<section class="stats" aria-label="Queue by stage">${repeat(stages,stage=>stage,stage=>html`<div class="stat"><span class="stat-label">${stage}</span><strong>${totals[stage] ?? 0}</strong></div>`)}</section>
<section class="panel" aria-labelledby="queue"><div class="panel-head"><h2 id="queue">Handoff review queue</h2><span>${visible.length} visible</span></div>
<div class="filters"><label>Search records<input type="search" placeholder="Title, owner or context" .value=${s.query} @input=${(e:Event)=>{desk.set({query:value(e)})}} /></label><label>Queue<select aria-label="Queue" .value=${s.filter} @change=${(e:Event)=>{desk.set({filter:value(e)})}}><option value="">All categories</option>${repeat(categories,x=>x,x=>html`<option .value=${x}>${x}</option>`)}</select></label><label>Sort by<select aria-label="Sort by" .value=${s.sort} @change=${(e:Event)=>{desk.set({sort:value(e)})}}><option value="due">Due date</option><option value="title">Title</option></select></label></div>
${s.success?html`<p role="status" class="success">${s.success}</p>`:nothing}
${s.error?html`<p role="alert">${s.error}</p><button type="button" @click=${(e:Event)=>{desk.load()}}>Reload list</button>`:nothing}
${s.loading?html`<p role="status">Loading records…</p>`:nothing}
${!s.loading && !s.error && visible.length===0?html`<p class="empty">No records match. Change the search or category.</p>`:nothing}
<ul class="records">${repeat(visible,row=>row.id,row=>html`<li><div><strong>${row.title}</strong><small>${row.owner} · ${row.context}</small></div><span class="pill">${row.category}</span><span>${row.stage}</span><span>${formatDate(row.due)}</span><button type="button" class="secondary" @click=${(e:Event)=>{desk.edit(row)}} aria-label=${'Edit '+row.title}>Edit</button></li>`)}</ul></section>`:nothing}
${s.page==='editor'?html`<div class="inner"><a href="#board">← Back to work queue</a><p class="eyebrow">SERVICE QUALITY / RECORD</p><h1>${s.id?'Edit record':'New record'}</h1><form class="panel form" @submit=${(e:Event)=>{desk.save(e)}}>
<label>Handoff review title<input required type="text" maxLength="100" .value=${s.draft.title} @input=${(e:Event)=>{desk.field('title',e)}} /></label><label>Quality reviewer<input required type="text" maxLength="80" .value=${s.draft.owner} @input=${(e:Event)=>{desk.field('owner',e)}} /></label><label>Queue<select aria-label="Queue" .value=${s.draft.category} @change=${(e:Event)=>{desk.field('category',e)}}>${repeat(categories,x=>x,x=>html`<option .value=${x}>${x}</option>`)}</select></label><label>Stage<select aria-label="Stage" .value=${s.draft.stage} @change=${(e:Event)=>{desk.field('stage',e)}}>${repeat(stages,x=>x,x=>html`<option .value=${x}>${x}</option>`)}</select></label><label>Scenario condition<input required type="text" maxLength="100" .value=${s.draft.context} @input=${(e:Event)=>{desk.field('context',e)}} /></label><label>Due date<input required type="date"  .value=${s.draft.due} @input=${(e:Event)=>{desk.field('due',e)}} /></label>
<label class="wide">Review observations<textarea required maxLength="500" rows="3" .value=${s.draft.notes} @input=${(e:Event)=>{desk.field('notes',e)}}></textarea></label>
${s.error?html`<p role="alert" class="wide">${s.error}</p>`:nothing}
<div class="wide form-actions"><button type="submit" .disabled=${s.saving}>${s.saving?'Saving…':'Save record'}</button><a href="#board">Cancel</a></div></form></div>`:nothing}
${s.page==='guide'?html`<div class="inner"><p class="eyebrow">SERVICE QUALITY / PLAYBOOK</p><h1>Check the route to a person</h1><article class="panel guide"><h2>Review checklist</h2><p>Use fictional scenarios. Check whether the person can reach a human, the receiving agent has useful context, and no unnecessary personal information is carried forward.</p><h2>Before closing a record</h2><p>Give the next team a named owner, a clear deadline and a short note explaining the decision. Use sample information in this workspace.</p><a href="https://digital-strategy.ec.europa.eu/en/news/eunomiaai-trustworthy-generative-ai-efficient-and-accessible-public-services">Read the official background</a></article></div>`:nothing}
</main><footer class="wrap footer">Service Handoff Quality Lab <span>·</span> Sample workspace</footer>`
 }
}
customElements.define('handoff-desk',HandoffDesk)
document.getElementById('app')!.append(document.createElement('handoff-desk'))
