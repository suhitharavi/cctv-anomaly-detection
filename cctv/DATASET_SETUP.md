# UCF-Crime Dataset Setup Guide

This guide explains how to download, arrange, and use the UCF-Crime dataset for training the hybrid classical-quantum anomaly detection model.

---

## 1. Download the Dataset

### Option A: From Kaggle (recommended)

1. **Create a Kaggle account** at [kaggle.com](https://www.kaggle.com) if you don’t have one.
2. **Accept the dataset rules** on the dataset page (required for download).
3. **Dataset link:**  
   [UCF-Crime Dataset - Kaggle](https://www.kaggle.com/datasets/odins0n/ucf-crime-dataset)
4. **Download:**
   - Click **Download** on the dataset page, or  
   - Use Kaggle API (after `pip install kaggle` and API key in `~/.kaggle/kaggle.json`):
     ```bash
     kaggle datasets download -d odins0n/ucf-crime-dataset
     unzip ucf-crime-dataset.zip -d data/
     ```

### Option B: Train on Kaggle (no local download)

- Add the dataset to your Kaggle notebook: **Add Data** → search **UCF-Crime** → Add.
- Path in notebook is usually: `/kaggle/input/ucf-crime-dataset/` (exact path may vary; check **Input** in the right panel).

---

## 2. Expected Folder Structure (frame-based)

The dataset is **pre-extracted frames**, not raw videos. After download you should have:

### Target structure

```
DATA_ROOT/   (e.g. /kaggle/input/ucf-crime-dataset/)
  Train/
    Abuse/
      Abuse001_x264_0.png
      Abuse001_x264_10.png
      Abuse001_x264_20.png
      ...
      Abuse002_x264_0.png
      ...
    Arrest/
    Arson/
    Assault/
    Burglary/
    Explosion/
    Fighting/
    Normal/
    RoadAccidents/
    Robbery/
    Shooting/
    Shoplifting/
    Stealing/
    Vandalism/
  Test/
    Abuse/
    Arrest/
    ... (same 14 class folders)
```

- **Train/** and **Test/** at top level; inside each, **14 class folders** (Abuse, Arrest, Arson, Assault, Burglary, Explosion, Fighting, Normal, RoadAccidents, Robbery, Shooting, Shoplifting, Stealing, Vandalism).
- **Images** (`.png`) inside each class folder. Filename format: `{VideoID}_{frame_index}.png`, e.g. `Abuse001_x264_180.png` → video ID = `Abuse001_x264`, frame index = `180` (every 10th frame: 0, 10, 20, …).
- Frames from the **same video** share the same prefix (video ID); the notebook **groups by video ID**, **sorts by numeric frame index**, and forms **fixed-length clips** (e.g. 16 frames) for training.

---

## 3. Using a Subset (faster training)

The full dataset has ~1.26M train and ~111k test images. The notebook limits how many **videos per class** are used when building clips (so total clips stay manageable).

### Suggested subset (videos per class)

| Goal              | Videos per class | Use case           |
|-------------------|------------------|--------------------|
| Quick demo        | 15–20            | Proof of concept   |
| Balanced (recomm.)| 30–45            | Good demo + report |
| Full (optional)   | None (all)       | Best accuracy      |

- In the notebook’s **Config** cell, set `SUBSET_PER_CLASS = 30` (or `None` to use all videos; slower).
- The notebook builds clips only from that many videos per class in Train/Test.

---

## 4. Paths Used in the Training Notebook

- **DATA_ROOT** must be the folder that **contains** `Train/` and `Test/` (not the Train or Test folder itself).
- **Kaggle:** `DATA_ROOT = "/kaggle/input/ucf-crime-dataset/"` (or the path shown in **Input** after adding the dataset).
- **Local:** e.g. `DATA_ROOT = "../data/ucf-crime-dataset/"` if you unzipped there.
- **Google Colab:** upload/unzip so you have `Train/` and `Test/`, then set `DATA_ROOT` to that folder.

---

## 5. Checklist Before Training

- [ ] Dataset has **Train/** and **Test/** with 14 class subfolders each (Abuse, Arrest, …, Vandalism).
- [ ] Class folders contain **PNG** (or JPG) frames with filenames like `Abuse001_x264_0.png` (video ID + frame index).
- [ ] **DATA_ROOT** points to the parent of `Train/` and `Test/`.
- [ ] Optional: set **SUBSET_PER_CLASS** (e.g. 30) in the notebook for a faster run.
- [ ] On Kaggle: dataset added to the notebook and **DATA_ROOT** set to the input path.

Once this is done, run the training notebook; it will group frames by video ID, sort by frame index, build clips, and train the model.
