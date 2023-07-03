import React, { useState } from "react";
import artifactsIcon from "../logo/artifactsIcon.svg";
import parametersIcon from "../logo/parametersIcon.svg";
import { Editor } from "primereact/editor";

const TrackingOptionsTabs = () => {
  const [text, setText] = useState("");

  return (
    <div className="trackingoptions-tabs">
      <ul class="nav nav-tabs" id="myTab" role="tablist">
        <li class="nav-item" role="presentation">
          <button
            class="nav-link active"
            id="artifacts-tab"
            data-bs-toggle="tab"
            data-bs-target="#artifacts-tab-pane"
            type="button"
            role="tab"
            aria-controls="artifacts-tab-pane"
            aria-selected="true"
          >
            <img src={artifactsIcon} alt="artifactsIcon" />
            <span>Artifacts</span>
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="parameters-tab"
            data-bs-toggle="tab"
            data-bs-target="#parameters-tab-pane"
            type="button"
            role="tab"
            aria-controls="parameters-tab-pane"
            aria-selected="false"
          >
            <img src={parametersIcon} alt="parametersIcon" />
            <span>Parameters</span>
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="metric-tab"
            data-bs-toggle="tab"
            data-bs-target="#metric-tab-pane"
            type="button"
            role="tab"
            aria-controls="metric-tab-pane"
            aria-selected="false"
          >
            <i class="fa-solid fa-chart-line"></i>
            <span> Metric</span>
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="tags-tab"
            data-bs-toggle="tab"
            data-bs-target="#tags-tab-pane"
            type="button"
            role="tab"
            aria-controls="tags-tab-pane"
            aria-selected="false"
          >
            <i class="fa-solid fa-tag"></i>
            <span> Tags</span>
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="des-tab"
            data-bs-toggle="tab"
            data-bs-target="#des-tab-pane"
            type="button"
            role="tab"
            aria-controls="des-tab-pane"
            aria-selected="false"
          >
            <i class="fa-regular fa-file-lines"></i>
            <span> Description</span>
          </button>
        </li>
      </ul>
      <div class="tab-content" id="myTabContent">
        <div
          class="tab-pane fade show active"
          id="artifacts-tab-pane"
          role="tabpanel"
          aria-labelledby="artifacts-tab"
          tabindex="0"
        >
          <div class="accordion" id="accordionExample">
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingOne">
                <button
                  class="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  <i class="fa-solid fa-folder"></i> DC
                </button>
              </h2>
              <div
                id="collapseOne"
                class="accordion-collapse collapse show"
                aria-labelledby="headingOne"
                data-bs-parent="#accordionExample"
              >
                <div class="accordion-body">Hello</div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingTwo">
                <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseTwo"
                  aria-expanded="false"
                  aria-controls="collapseTwo"
                >
                  <i class="fa-solid fa-folder"></i> DC
                </button>
              </h2>
              <div
                id="collapseTwo"
                class="accordion-collapse collapse"
                aria-labelledby="headingTwo"
                data-bs-parent="#accordionExample"
              >
                <div class="accordion-body">Hi</div>
              </div>
            </div>
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingThree">
                <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseThree"
                  aria-expanded="false"
                  aria-controls="collapseThree"
                >
                  <i class="fa-solid fa-folder"></i> DC
                </button>
              </h2>
              <div
                id="collapseThree"
                class="accordion-collapse collapse"
                aria-labelledby="headingThree"
                data-bs-parent="#accordionExample"
              >
                <div class="accordion-body">Hello World!!!</div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="tab-pane fade"
          id="parameters-tab-pane"
          role="tabpanel"
          aria-labelledby="parameters-tab"
          tabindex="0"
        >
          <table cellPadding="6" width="30%">
            <thead>
              <tr>
                <th>Name</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mani</td>
                <td>99</td>
              </tr>
              <tr>
                <td>Mani</td>
                <td>99</td>
              </tr>
              <tr>
                <td>Mani</td>
                <td>99</td>
              </tr>
              <tr>
                <td>Mani</td>
                <td>99</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          class="tab-pane fade"
          id="metric-tab-pane"
          role="tabpanel"
          aria-labelledby="metric-tab"
          tabindex="0"
        >
          <table cellPadding="6" width="30%">
            <thead>
              <tr>
                <th>Name</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mani</td>
                <td>99</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          class="tab-pane fade"
          id="tags-tab-pane"
          role="tabpanel"
          aria-labelledby="tags-tab"
          tabindex="0"
        >
          <table cellPadding="6" width="30%">
            <thead>
              <tr>
                <th>Name</th>
                <th>Value</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mani</td>
                <td>99</td>
                <td>
                  <i class="fa-solid fa-pen"></i>
                  <i class="fa-solid fa-trash"></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          class="tab-pane fade"
          id="des-tab-pane"
          role="tabpanel"
          aria-labelledby="des-tab"
          tabindex="0"
        >
          <Editor
            value={text}
            onTextChange={(e) => setText(e.htmlValue)}
            style={{ height: "320px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default TrackingOptionsTabs;
