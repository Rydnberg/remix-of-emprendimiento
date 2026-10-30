<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- App state (account, membership, pet, reports) is a client-only demo in `src/lib/app-store.tsx` persisted to localStorage; swap for a real backend + payment provider before launch, since nothing is processed server-side yet.
- All UI text goes through `t(es, en)` from `useApp()`; Spanish is primary.
- Seismic data comes from the USGS feed with demo fallback (`src/lib/demo-data.ts`); canine data must always stay labeled experimental and never drive alerts.
