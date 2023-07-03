import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../logo/mlangles360logo.png";
import { useNavigate } from "react-router-dom";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Robot from "./Robot";
import { Dropdown } from "primereact";
import Loading from "../Components/Loading";
import { backend_url, backend_url1 } from "../Config";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();
  const [design, setDesign] = useState({});
  const [phone, setPhone] = useState({ "name": "United States (+1)", "code": "+1" });
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [eye, setEye] = useState(true);

  let designationData = [
    { "name": "Data Engineer", "code": "Data Engineer" },
    { "name": "Data Scientist", "code": "Data Scientist" },
    { "name": "ML Engineer", "code": "ML Engineer" },
    { "name": "Others", "code": "Others" },
  ];

  const countries = [
    { name: "Afghanistan (+93) ", code: "+93" },
    // {"name": "Åland Islands", "code": "AX"},
    { name: "Albania (+355) ", code: "+355" },
    { name: "Algeria (+213) ", code: "+213" },
    { name: "American Samoa (+1-684) ", code: "+1-684" },
    { name: "Andorra (+376) ", code: "+376" },
    { name: "Angola (+244) ", code: "+244" },
    { name: "Anguilla (+1-264) ", code: "+1-264" },
    { name: "Antarctica (+672) ", code: "+672" },
    { name: "Antigua and Barbuda (+1-268) ", code: "+1-268" },
    { name: "Argentina (+54) ", code: "+54" },
    { name: "Armenia (+374) ", code: "+374" },
    { name: "Aruba (+297) ", code: "+297" },
    { name: "Australia (+61) ", code: "+61" },
    { name: "Austria (+43) ", code: "+43" },
    { name: "Azerbaijan (+994) ", code: "+994" },
    { name: "Bahamas (+1-242) ", code: "+1-242" },
    { name: "Bahrain (+973) ", code: "+973" },
    { name: "Bangladesh (+880) ", code: "+880" },
    { name: "Barbados (+1-246) ", code: "+1-246" },
    { name: "Belarus (+375) ", code: "+375" },
    { name: "Belgium (+32) ", code: "+32" },
    { name: "Belize (+501) ", code: "+501" },
    { name: "Benin (+229) ", code: "+229" },
    { name: "Bermuda (+1-441) ", code: "+1-441" },
    { name: "Bhutan (+975) ", code: "+975" },
    { name: "Bolivia (+591) ", code: "+591" },
    { name: "Bosnia and Herzegovina (+387) ", code: "+387" },
    { name: "Botswana (+267) ", code: "+267" },
    // {"name": "Bouvet Island (+) ", "code": "BV"},
    { name: "Brazil (+55) ", code: "+55" },
    { name: "British Indian Ocean Territory (+246) ", code: "+246" },
    // {"name": "Brunei Darussalam (+) ", "code": "BN"},
    { name: "Bulgaria (+359) ", code: "+359" },
    { name: "Burkina Faso (+226) ", code: "+226" },
    { name: "Burundi (+257) ", code: "+257" },
    { name: "Cambodia (+855) ", code: "+855" },
    { name: "Cameroon (+237) ", code: "+237" },
    { name: "Canada (+1) ", code: "+1" },
    { name: "Cape Verde (+238) ", code: "+238" },
    { name: "Cayman Islands (+1-345) ", code: "+1-345" },
    { name: "Central African Republic (+236) ", code: "+236" },
    { name: "Chad (+235) ", code: "+235" },
    { name: "Chile (+56) ", code: "+56" },
    { name: "China (+86) ", code: "+86" },
    { name: "Christmas Island (+61) ", code: "+61" },
    { name: "Cocos (Keeling) Islands (+61) ", code: "+61" },
    { name: "Colombia (+57) ", code: "+57" },
    { name: "Comoros (+269) ", code: "+269" },
    // {"name": "Congo", "code": "CG"},
    // {"name": "Congo, The Democratic Republic of the", "code": "CD"},
    { name: "Cook Islands (+682) ", code: "+682" },
    { name: "Costa Rica (+506) ", code: "+506" },
    // {"name": "Cote D\"Ivoire", "code": "CI"},
    { name: "Croatia (+385) ", code: "+385" },
    { name: "Cuba (+53) ", code: "+53" },
    { name: "Cyprus (+357) ", code: "+357" },
    { name: "Czech Republic (+420) ", code: "+420" },
    { name: "Denmark (+45) ", code: "+45" },
    { name: "Djibouti (+253) ", code: "+253" },
    { name: "Dominica (+1-767) ", code: "+1-767" },
    { name: "Dominican Republic (+1-809) ", code: "+1-809" },
    { name: "Ecuador (+593) ", code: "+593" },
    { name: "Egypt (+20) ", code: "+20" },
    { name: "El Salvador (+503) ", code: "+503" },
    { name: "Equatorial Guinea (+240) ", code: "+240" },
    { name: "Eritrea (+291) ", code: "+291" },
    { name: "Estonia (+372) ", code: "+372" },
    { name: "Ethiopia (+251) ", code: "+251" },
    { name: "Falkland Islands (Malvinas)(+500) ", code: "+500" },
    { name: "Faroe Islands (+298) ", code: "+298" },
    { name: "Fiji (+679) ", code: "+679" },
    { name: "Finland (+358) ", code: "+358" },
    { name: "France (+33) ", code: "+33" },
    // {"name": "French Guiana", "code": "GF"},
    { name: "French Polynesia (+689) ", code: "+689" },
    // {"name": "French Southern Territories", "code": "TF"},
    { name: "Gabon (+241) ", code: "+241" },
    { name: "Gambia (+220) ", code: "+220" },
    { name: "Georgia (+995) ", code: "+995" },
    { name: "Germany (+49) ", code: "+49" },
    { name: "Ghana (+233) ", code: "+233" },
    { name: "Gibraltar (+350) ", code: "+350" },
    { name: "Greece (+30) ", code: "+30" },
    { name: "Greenland (+299) ", code: "+299" },
    { name: "Grenada (+1-473) ", code: "+1-473" },
    // {"name": "Guadeloupe (+) ", "code": "GP"},
    { name: "Guam (+1-671) ", code: "+1-671" },
    { name: "Guatemala (+502) ", code: "+502" },
    { name: "Guernsey (+44-1481) ", code: "+44-1481" },
    { name: "Guinea (+224) ", code: "+224" },
    { name: "Guinea-Bissau (+245) ", code: "+245" },
    { name: "Guyana (+592) ", code: "+592" },
    { name: "Haiti (+509) ", code: "+509" },
    // {"name": "Heard Island and Mcdonald Islands", "code": "HM"},
    // {"name": "Holy See (Vatican City State)", "code": "VA"},
    { name: "Honduras (+504) ", code: "+504" },
    { name: "Hong Kong (+852) ", code: "+852" },
    { name: "Hungary (+36) ", code: "+36" },
    { name: "Iceland (+354) ", code: "+354" },
    { name: "India (+91) ", code: "+91" },
    { name: "Indonesia (+62) ", code: "+62" },
    { name: "Iran (+98) ", code: "+98" },
    { name: "Iraq (+964) ", code: "+964" },
    { name: "Ireland (+353) ", code: "+353" },
    { name: "Isle of Man (+44-1624) ", code: "+44-1624" },
    { name: "Israel (+972) ", code: "+972" },
    { name: "Italy (+39) ", code: "+39" },
    { name: "Jamaica (+1-876) ", code: "+1-876" },
    { name: "Japan (+81) ", code: "+81" },
    { name: "Jersey (+44-1534) ", code: "+44-1534" },
    { name: "Jordan (+962) ", code: "+962" },
    { name: "Kazakhstan (+7) ", code: "+7" },
    { name: "Kenya (+254) ", code: "+254" },
    { name: "Kiribati (+686) ", code: "+686" },
    // {"name": "Korea, Democratic People\"S Republic of", "code": "KP"},
    // {"name": "Korea, Republic of", "code": "KR"},
    { name: "Kuwait (+965) ", code: "+965" },
    { name: "Kyrgyzstan (+996) ", code: "+996" },
    // {"name": "Lao People\"S Democratic Republic", "code": "LA"},
    { name: "Latvia (+371) ", code: "+371" },
    { name: "Lebanon (+961) ", code: "+961" },
    { name: "Lesotho (+266) ", code: "+266" },
    { name: "Liberia (+231) ", code: "+231" },
    { name: "Libya (+218) ", code: "+218" },
    { name: "Liechtenstein (+423) ", code: "+218" },
    { name: "Lithuania (+370) ", code: "+370" },
    { name: "Luxembourg (+352) ", code: "+352" },
    { name: "Macao (+853) ", code: "+853" },
    { name: "Macedonia (+389) ", code: "+389" },
    { name: "Madagascar (+261)  ", code: "+261" },
    { name: "Malawi (+265) ", code: "+265" },
    { name: "Malaysia (+60) ", code: "+60" },
    { name: "Maldives (+960) ", code: "+960" },
    { name: "Mali (+223) ", code: "+223" },
    { name: "Malta (+356) ", code: "+356" },
    { name: "Marshall Islands (+692) ", code: "+692" },
    // {"name": "Martinique", "code": "MQ"},
    { name: "Mauritania (+222) ", code: "+222" },
    { name: "Mauritius (+230) ", code: "+230" },
    { name: "Mayotte (+262) ", code: "+262" },
    { name: "Mexico (+52) ", code: "+52" },
    { name: "Micronesia (+691) ", code: "+691" },
    { name: "Moldova (+373) ", code: "+373" },
    { name: "Monaco (+377) ", code: "+377" },
    { name: "Mongolia (+976) ", code: "+976" },
    { name: "Montserrat (+1-664) ", code: "+1-664" },
    { name: "Morocco (+212) ", code: "+212" },
    { name: "Mozambique (+258) ", code: "+258" },
    { name: "Myanmar (+95) ", code: "+95" },
    { name: "Namibia (+264) ", code: "+264" },
    { name: "Nauru (+674) ", code: "+674" },
    { name: "Nepal (+977) ", code: "+977" },
    { name: "Netherlands (+31) ", code: "+31" },
    { name: "Netherlands Antilles (+599) ", code: "+599" },
    { name: "New Caledonia (+687) ", code: "+687" },
    { name: "New Zealand (+64) ", code: "+64" },
    { name: "Nicaragua (+505) ", code: "+505" },
    { name: "Niger (+227) ", code: "+227" },
    { name: "Nigeria (+234) ", code: "+234" },
    { name: "Niue (+683) ", code: "+683" },
    // {"name": "Norfolk Island", "code": "NF"},
    { name: "Northern Mariana Islands (+1-670) ", code: "+1-670" },
    { name: "Norway (+47) ", code: "+47" },
    { name: "Oman (+968) ", code: "+968" },
    { name: "Pakistan (+92) ", code: "+92" },
    { name: "Palau (+680) ", code: "+680" },
    { name: "Palestinie (+970) ", code: "+970" },
    { name: "Panama (+507) ", code: "+507" },
    { name: "Papua New Guinea (+675) ", code: "+675" },
    { name: "Paraguay (+595) ", code: "+595" },
    { name: "Peru (+51) ", code: "+51" },
    { name: "Philippines (+63) ", code: "+63" },
    { name: "Pitcairn (+64) ", code: "+64" },
    { name: "Poland (+48) ", code: "+48" },
    { name: "Portugal (+351) ", code: "+351" },
    { name: "Puerto Rico (+1-789) ", code: "+1-789" },
    { name: "Qatar (+974) ", code: "+974" },
    { name: "Reunion (+262) ", code: "+262" },
    { name: "Romania (+40) ", code: "+40" },
    { name: "Russian (+7) ", code: "+7" },
    { name: "RWANDA (+250) ", code: "+250" },
    { name: "Saint Helena (+290) ", code: "+290" },
    { name: "Saint Kitts and Nevis (+1-869) ", code: "+1-869" },
    { name: "Saint Lucia (+1-758) ", code: "+1-758" },
    { name: "Saint Pierre and Miquelon (+508) ", code: "+508" },
    { name: "Saint Vincent and the Grenadines (+1-784) ", code: "+1-784" },
    { name: "Samoa (+685) ", code: "+685" },
    { name: "San Marino (+378) ", code: "+378" },
    { name: "Sao Tome and Principe (+239) ", code: "+239" },
    { name: "Saudi Arabia (+966) ", code: "+966" },
    { name: "Senegal (+221) ", code: "+221" },
    { name: "Serbia (+381) ", code: "+381" },
    { name: "Seychelles (+248) ", code: "+248" },
    { name: "Sierra Leone (+232) ", code: "+232" },
    { name: "Singapore (+65) ", code: "+65" },
    { name: "Slovakia (+421) ", code: "+421" },
    { name: "Slovenia (+386) ", code: "+386" },
    { name: "Solomon Islands (+677) ", code: "+677" },
    { name: "Somalia (+252) ", code: "+252" },
    { name: "South Africa (+27) ", code: "+27" },
    // {"name": "South Georgia and the South Sandwich Islands", "code": "GS"},
    { name: "Spain (+34) ", code: "+34" },
    { name: "Sri Lanka (+94) ", code: "+94" },
    { name: "Sudan (+549) ", code: "+549" },
    { name: "Suriname (+597) ", code: "+597" },
    // {"name": "Svalbard and Jan Mayen", "code": "SJ"},
    // {"name": "Swaziland", "code": "SZ"},
    // {"name": "Sweden", "code": "SE"},
    { name: "Switzerland (+41) ", code: "+41" },
    { name: "Syria (+963) ", code: "+963" },
    { name: "Taiwan (+886) ", code: "+886" },
    { name: "Tajikistan (+992) ", code: "+992" },
    { name: "Tanzania (+255) ", code: "+255" },
    { name: "Thailand (+66) ", code: "+66" },
    // {"name": "Timor-Leste", "code": "TL"},
    { name: "Togo (+676) ", code: "+TG" },
    // {"name": "Tokelau", "code": "TK"},
    // {"name": "Tonga", "code": "TO"},
    { name: "Trinidad and Tobago (+1-868) ", code: "+1-868" },
    { name: "Tunisia (+216) ", code: "+216" },
    { name: "Turkey (+90) ", code: "+90" },
    { name: "Turkmenistan (+993) ", code: "+993" },
    { name: "Turks and Caicos Islands (+1-649) ", code: "+1-649" },
    { name: "Tuvalu (+688) ", code: "+688" },
    { name: "Uganda (+256) ", code: "+256" },
    { name: "Ukraine (+380) ", code: "+380" },
    { name: "United Arab Emirates (+971) ", code: "+971" },
    { name: "United Kingdom (+44)", code: "+44" },
    { name: "United States (+1)", code: "+1" },
    // {"name": "United States Minor Outlying Islands", "code": "UM"},
    { name: "Uruguay (+598) ", code: "+598" },
    { name: "Uzbekistan (+998) ", code: "+998" },
    { name: "Vanuatu (+678) ", code: "+678" },
    { name: "Venezuela (+58) ", code: "+58" },
    { name: "VietNam (+84) ", code: "+84" },
    // {"name": "Virgin Islands, British", "code": "VG"},
    // {"name": "Virgin Islands, U.S.", "code": "VI"},
    { name: "Wallis and Futuna (+681) ", code: "+681" },
    { name: "Western Sahara (+212) ", code: "+212" },
    { name: "Yemen (+967) ", code: "+967" },
    { name: "Zambia (+260) ", code: "+260" },
    { name: "Zimbabwe (+263) ", code: "+263" },
  ];

  const [user, setUser] = useState({
    user_first_name: "",
    user_last_name: "",
    user_mobile: "",
    department: "",
    business_unit: "",
    user_organization: "",
    country_code: "+1",
    email: "",
    password: "",
    re_password: "",
  });

  function changeHandler(e) {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "user_mobile") {
      if (value.length <= 10) {
        setUser({ ...user, [name]: value });
      }
    } else {
      setUser({ ...user, [name]: value });
    }
  }

  function dropdownChange(field, data) {
    // console.log("data-------", data)
    if (field === "design") {
      if (data.code === "Others") {
        setUser({ ...user, ["designation"]: "" })
      } else {
        setUser({ ...user, ["designation"]: data.code });
      }
      setDesign({ name: data.code, code: data.code });
    } else if (field === "phone") {
      setUser({ ...user, ["country_code"]: data.code });
      setPhone({ name: data.name, code: data.code });
    }
  }

  // console.log("design and phone ", design, phone, user);


  function funError() {
    setTimeout(() => {
      setError("");
    }, 4000);
  }

  async function submitForm(e) {
    try {
      e.preventDefault();
      console.log("user data is -----", user);

      if (
        user.email.includes("gmail") ||
        user.email.includes("yahoo") ||
        user.email.includes("outlook") ||
        user.email.includes("protonmail") ||
        user.email.includes("zoho") ||
        user.email.includes("icloud")
      ) {
        console.log("only orgnaisation mail id should be there");
        setError("Use Only Orgnaisation mail_id");
        setUser({ ...user, email: "" });
        setTimeout(() => {
          setError("");
        }, 4000);
      } else if (user.user_mobile.length !== 10) {
        setError("Enter Correct Mobile Number");
        funError();

      } else {
        setOpen(true);
        let newData = user;
        // let newData = { ...user, user_mobile: `${user.country_code} ${user.user_mobile}` };
        // delete newData.country_code;
        newData.is_superuser = 1;
        setOpen(true);
        const res = await axios.post(`${backend_url}/check_mobile`, { "mobile": newData.user_mobile });
        setOpen(false);
        if (res.data.success) {
          setOpen(true);
          fetch(`${backend_url}/auth/users/`, {
            method: "POST",
            body: JSON.stringify(newData),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          })
            .then((response) => response.json())
            .then((data) => {
              setOpen(false);
              let ans = Object.keys(data).length;
              let ans1 = Object.values(data);
              if (ans === 1) {
                setError(ans1[0][0]);
                funError();
              } else {
                navigate("/register_success");
              }
            });
        } else {
          setError(res.data.message);
          funError();
        }
      }

    } catch (e) {
      console.log("There is an Error--", e)
    }
  }

  return (
    <div className="bgBlack vh-100">
      <div className="container">
        <Loading loading={open} />

        <div className="row vh100 flex">
          <div className="col-sm-6 flex-col">
            <div className="d-flex">
              <div className="col-md-12 flex-col align-items-center">
                <h2 className="datascience">Bring your Data Science to Life</h2>
                <Robot />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="register_card">
              <form onSubmit={submitForm} >
                <div className="register-form">
                  <div className="register_title">
                    <img src={logo} className="mlangleslogo" alt="" />
                    <div>
                      <span className="login_t">Register</span>
                    </div>
                    <div>
                      <span className="to_your_account">Signup to Mlangles</span>
                    </div>
                  </div>
                  <div className="register_inputs">
                    <h4 className="errorName">
                      {error ? error : ""}
                    </h4>
                    <div className="inputs_one">
                      <input autoComplete="off"
                        className="login_username register_login_name"
                        placeholder="First name"
                        value={user.user_first_name}
                        name="user_first_name"
                        onChange={changeHandler}
                        required
                      />
                      <br />
                      <input autoComplete="off"

                        className="login_username register_login_name2"
                        placeholder="Last name"
                        value={user.user_last_name}
                        name="user_last_name"
                        onChange={changeHandler}
                        required
                      />
                    </div>
                    <div className="inputs_two">
                      <div className="phonenumber">
                        <Dropdown value={phone} required onChange={(e) => dropdownChange("phone", e.value)}
                          options={countries}
                          type="text"
                          optionLabel="name"
                          placeholder="Phone Number" className="login_username w-half pad-0 md:w-14rem" />
                      </div>

                      <input autoComplete="off"
                        className="login_username register_login_name2 phone"
                        placeholder="Mobile No."
                        type="number"
                        value={user.user_mobile}
                        name="user_mobile"
                        onChange={user.user_mobile.length <= 10 ? changeHandler : ""}
                        required
                      />
                    </div>
                    <div className="inputs_three">
                      <input autoComplete="off"
                        className="login_username register_login_name"
                        placeholder="Organisation"
                        value={user.user_organization}
                        name="user_organization"
                        onChange={changeHandler}
                        required
                      />
                      <br />
                      <input autoComplete="off"

                        className="login_username register_login_name2"
                        placeholder="Organisation Email"
                        value={user.email}
                        name="email"
                        type="email"
                        onChange={changeHandler}
                        required
                      />
                    </div>

                    <div className="inputs_three">
                      <input autoComplete="off"

                        className="login_username register_login_name"
                        placeholder="Department"
                        value={user.department}
                        name="department"
                        onChange={changeHandler}
                        required
                      />
                      <br />
                      <input autoComplete="off"

                        className="login_username register_login_name2"
                        placeholder="Business Unit"
                        value={user.business_unit}
                        name="business_unit"
                        onChange={changeHandler}
                        required
                      />
                    </div>

                    {/* <div className="inputs_three">
                      <Dropdown value={design} required onChange={(e) => dropdownChange("design", e.value)}
                        options={designationData}
                        optionLabel="name"
                        placeholder="Designation" className="login_username w-half pad-0 md:w-14rem" />
                    </div> */}

                    {design.code === "Others" ?
                      <div className="inputs_three">
                        <input autoComplete="off"

                          className="login_username"
                          placeholder="Designation"
                          value={user.designation}
                          name="designation"
                          onChange={changeHandler}
                          required
                        />
                      </div> : <></>}

                    <div className="inputs_four">
                      <div className="pos-rel w50reg">
                        <input autoComplete="off"
                          className="login_username register_login_name eye-register"
                          placeholder="Password"
                          value={user.password}
                          name="password"
                          onChange={changeHandler}
                          required
                          type={eye ? "password" : "text"}
                        />
                        <div className="eye-icon" onClick={(e) => setEye(!eye)}>
                          {eye ? (
                            <i className="fa-solid fa-eye-slash"></i>
                          ) : (
                            <i className="fa-solid fa-eye"></i>
                          )}
                        </div>
                      </div>
                      <div className="pos-rel w50reg">
                        <input autoComplete="off"
                          className="login_username register_login_name2 conf"
                          placeholder="Confirm Password"
                          value={user.re_password}
                          name="re_password"
                          onChange={changeHandler}
                          type="password"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="accept d-flex align-items-center">
                  <input
                    required
                    className="checkbox2"
                    type="checkbox"
                    id="tick"
                  />
                  <label htmlFor="tick" className="remember2">
                    Accept
                    <Link className="register_now" to="">
                      Terms & Conditions
                    </Link>
                  </label>
                </div>
                <div className="register_button">
                  <button type="submit" className="register_btn">
                    Register
                  </button>
                </div>
                <div>
                  <p className="not_a_member">
                    Already have a account?
                    <Link to="/" className="register_now">
                      Go to Login
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
