open Solvuu_build.Std

let project_name = "EsyOcaml"
let version = "0.1.0"

let lib = Project.lib project_name
  ~dir: "lib"
  ~style:(`Pack project_name)
  ~pkg: project_name

let app = Project.app "hello"
  ~file: "bin/hello.ml"
  ~internal_deps: [lib]

let () =
  Project.basic1 ~project_name ~version [lib; app]
