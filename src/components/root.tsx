import appRoutes from "server/routes"

const Root = ({ initialData }: { initialData: InitialData }) => {
  const Component = appRoutes[initialData.path].component
  return (
    <>
      <Component />
      <div className="footer">
        <div className="powered-by">
          Powerd By{" "}
          <a href="https://galoy.io/" target="_blank" rel="noreferrer">
            Galoy
          </a>
        </div>
      </div>
    </>
  )
}

export default Root
