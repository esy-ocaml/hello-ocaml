open LTerm_style
open LTerm_text


let%expect_test "addition" =
    print_endline "4";
    [%expect {|
    a
|}]

let hello () =
  LTerm.printls (eval [B_fg(red); S"Hello,"; E_fg; S" "; B_fg(green); S"World!"; E_fg])
