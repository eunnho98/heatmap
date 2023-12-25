import pickle
import joblib
import pandas as pd
from pandas import DataFrame
import numpy as np


def readData() -> DataFrame:
    df = pd.read_csv("./data.csv")
    return df[["x", "y", "row", "col", "x_rad", "y_rad", "z_rad"]]


def getPoint(x_cut, y_cut, z_cut):
    x_cut = int(x_cut)
    y_cut = int(y_cut)
    z_cut = int(z_cut)
    if x_cut * y_cut * z_cut > 1000:
        return "Over 1000"

    df = readData()
    df["x_qcut"] = pd.qcut(df["x_rad"], q=x_cut)
    df["y_qcut"] = pd.qcut(df["y_rad"], q=y_cut)
    df["z_qcut"] = pd.qcut(df["z_rad"], q=z_cut)

    return df


def getDots(dataf: DataFrame, x_rad: float, y_rad: float, z_rad: float):
    df = dataf.copy(deep=False)
    x_intervals = df["x_qcut"].cat.categories
    y_intervals = df["y_qcut"].cat.categories
    z_intervals = df["z_qcut"].cat.categories

    try:
        x_idx = x_intervals.get_loc(x_rad)
        y_idx = y_intervals.get_loc(y_rad)
        z_idx = z_intervals.get_loc(z_rad)
        x_cat, y_cat, z_cat = x_intervals[x_idx], y_intervals[y_idx], z_intervals[z_idx]
    except KeyError as e:
        return -1

    df = df.set_index(["x_qcut", "y_qcut", "z_qcut"]).sort_index(
        level=["x_qcut", "y_qcut", "z_qcut"]
    )
    try:
        result: DataFrame = df.loc[x_cat, y_cat, z_cat][["x", "y", "row", "col"]]
        result = result.reset_index().drop(["x_qcut", "y_qcut", "z_qcut"], axis=1)
        return result.to_dict()

    except KeyError as e:
        return -1


def get_model_and_wh(name):
    model_path = f"./model/{name}.pkl"
    wh_path = f"./data/whdata/{name}.pickle"

    with open(wh_path, "rb") as f:
        wh = pickle.load(f)

    model = joblib.load(model_path)

    return model, wh


def pred_val(model, data, wh):
    """
    {'0': {'width': 0.0, 'height': 0.0, 'pos': 4},
    '1': {'width': 0.0, 'height': 0.0, 'pos': 4},
    '2': {'width': 0.0, 'height': 0.0, 'pos': 4},
    '3': {'width': 0.0, 'height': 0.0, 'pos': 4},
    '4': {'width': 0.0, 'height': 0.0, 'pos': 4},
    '5': {'width': 0.0, 'height': 0.0, 'pos': 4},
    '6': {'width': 0.0, 'height': 0.0, 'pos': 1},
    '7': {'width': 0.0, 'height': 0.0, 'pos': 1},
    '8': {'width': 9.0, 'height': 2.0, 'pos': 4}}
    """
    item = [[data["acc_x"], data["acc_y"], data["acc_z"]]]

    pred = model.predict(item)
    res = np.round(pred, decimals=2)
    result_dict = {index: value for index, value in enumerate(res[0])}

    wh_copy = wh.copy()
    for key, value in wh_copy.items():
        value["height"] = value["height"] * result_dict[int(key)]
        value["width"] = value["width"] * result_dict[int(key)]

    return wh_copy


def get_row_col_group(clientid):
    df = pd.read_csv(f"./data/{clientid}")
    grouped_row_col = df.groupby(["row", "col"])
    dfs = {}
    for (row, col), group_df in grouped_row_col:
        name = f"row{row}, col{col}"
        dfs[name] = group_df[
            [
                "x",
                "y",
                "x_rad",
                "y_rad",
                "z_rad",
                "row",
                "col",
                "x_degree",
                "y_degree",
                "z_degree",
            ]
        ]
        dfs[name] = dfs[name].reset_index().drop("index", axis=1)
    return dfs
